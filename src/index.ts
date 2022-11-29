import 'dotenv/config';
import {DbService} from './services/db.service';
import {Field, MauticApiService} from './services/mautic-api.service';
import { arrayChunk } from './utils/chunk.array';
import { toMautic } from './utils/data.adapter';
import {Logger} from "./utils/logger";
import {clog} from "./utils/clog";

const bootstrap = async () => {
    const db = new DbService();
    const mauticApi = new MauticApiService();
    const logger = new Logger();
    clog('Getting data from DB...');
    let crmData;
    try {
      crmData = await db.getCRMData(0, 10000);
    } catch(e) {
      console.error(e);
    }
    clog('Prepare data for mautic...');
    const studyTypes = await mauticApi.getFieldValues(Field.studytype);
    const scheduleConsultants = await mauticApi.getFieldValues(Field.scheduleconsultant);
    const allLeads = Object.values(crmData).map(lead => {
      const fields = toMautic(lead);
      if ('studytype' in fields && !studyTypes.includes(fields.studytype)) {
        logger.error(JSON.stringify({
          skip: {
            field: 'studytype',
            value: fields.studytype
          }
        }));
        delete fields.studytype;
      }
      if ('scheduleconsultant' in fields && !scheduleConsultants.includes(fields.scheduleconsultant)) {
        logger.error(JSON.stringify({
          skip: {
            field: 'scheduleconsultant',
            value: fields.scheduleconsultant
          }
        }));
        delete fields.scheduleconsultant;
      }
      return fields;
    });
    clog('Export data to mautic...');
    const chunks = arrayChunk(allLeads, 200);
    let page = 1;
    for (const leads of chunks) {
      clog(`Page ${page} of ${chunks.length}`);
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
            mauticId: null
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
      page++;
    }
    clog('Done');
}

bootstrap();
