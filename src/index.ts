import 'dotenv/config';
import {DbService} from './services/db.service';
import {Field, MauticApiService} from './services/mautic-api.service';
import {toMautic} from './utils/data.adapter';
import {Logger} from './utils/logger';
import {clog} from './utils/clog';

const {FETCH_LIMIT = 200} = process.env;

const bootstrap = async () => {
  clog('Start process');
  const db = new DbService();
  const mauticApi = new MauticApiService();
  const studyTypes = await mauticApi.getFieldValues(Field.studytype);
  const scheduleConsultants = await mauticApi.getFieldValues(Field.scheduleconsultant);
  const logger = new Logger();
  const count = await db.getCount();
  clog('Count records:', count);
  const limit = Number(FETCH_LIMIT);
  const pages = Math.ceil(count / limit);
  for (let p = 0; p < pages; p++) {
    clog('Page:', p + 1, 'of pages:', pages);
    let crmData;
    try {
      clog('Getting data from DB...');
      crmData = await db.getCRMData(p * limit, limit);
    } catch (e) {
      clog('ERROR Message:', e.message);
      clog('ERROR', e);
      break;
    }

    const leads = Object.values(crmData).map(lead => {
      const fields = toMautic(lead);
      if ('studytype' in fields && !studyTypes.includes(fields.studytype)) {
        logger.error(JSON.stringify({
          skip: {
            field: 'studytype',
            value: fields.studytype,
          },
        }));
        delete fields.studytype;
      }
      if ('scheduleconsultant' in fields && !scheduleConsultants.includes(fields.scheduleconsultant)) {
        logger.error(JSON.stringify({
          skip: {
            field: 'scheduleconsultant',
            value: fields.scheduleconsultant,
          },
        }));
        delete fields.scheduleconsultant;
      }
      return fields;
    });
    clog('Export data to mautic...');

    let result;
    try {
      result = await mauticApi.batchCreateLeads(leads);
    } catch (e) {
      clog('ERROR Message:', e.message);
      clog('ERROR', e);
      logger.error(e.message);
      continue;
    }

    if ('statusCodes' in result) {
      result.statusCodes.forEach((code, index) => {
        const logResult = {
          email: leads[index].email,
          statusCode: code,
          errors: null,
          mauticId: null,
        };
        if ([200, 201].includes(code)) {
          logResult.mauticId = result.contacts[index].id;
        } else if ('errors' in result) {
          const errors = [];
          for (const field in result.errors[index].details) {
            errors.push({
              field,
              errorMessages: result.errors[index].details[field],
              mtaValue: leads[index][field],
            })
          }
          logResult.errors = errors;
        }
        logResult.errors !== null
          ? logger.error(JSON.stringify(logResult))
          : logger.log(JSON.stringify(logResult));
      });
    }
  }
  clog('Done');
}

bootstrap();
