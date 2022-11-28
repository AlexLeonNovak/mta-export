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
    let crmData;
    try {
      crmData = await db.getCRMData(0, 100);
    } catch(e) {
      console.error(e);
    }
    const studyTypes = await mauticApi.getFieldValues(Field.studytype);
    const scheduleConsultants = await mauticApi.getFieldValues(Field.scheduleconsultant);
    const allLeads = Object.values(crmData).map(lead => {
      const fields = toMautic(lead);
      if ('studytype' in fields && !studyTypes.includes(fields.studytype)) {
        logger.log(JSON.stringify({
          skip: {
            field: 'studytype',
            value: fields.studytype
          }
        }));
        delete fields.studytype;
      }
      if ('scheduleconsultant' in fields && !scheduleConsultants.includes(fields.scheduleconsultant)) {
        logger.log(JSON.stringify({
          skip: {
            field: 'scheduleconsultant',
            value: fields.scheduleconsultant
          }
        }));
        delete fields.scheduleconsultant;
      }
      return fields;
    });
    const chunks = arrayChunk(allLeads, 200);
    for (const leads of chunks) {
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
            // TODO: change to MTA
            booknetCustomerId: leads[index].customerid,
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
                errorMessages: result.errors[index].details[field],
                booknetValue: leads[index][field],
              })
            }
            logResult.errors = errors;
          }
          logResult.errors !== null
              ? logger.error(JSON.stringify(logResult))
              : logger.log(JSON.stringify(logResult));
        });
      }
      clog('Done');
    }
}

bootstrap();
