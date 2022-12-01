import 'dotenv/config';
import {Command} from 'commander';
import {DbService} from './services/db.service';
import {Field, MauticApiService} from './services/mautic-api.service';
import {CRMToMautic, leadsToMautic} from './utils/data.adapter';
import {Logger} from './utils/logger';
import {clog} from './utils/clog';
import {arrayChunk} from './utils/chunk.array';
import {saveCSV} from './services/csv.service';
import * as path from 'path';
import {DateTime} from 'luxon';

enum Source {
  CRM = 'crm',
  LEADS = 'leads'
}

const db = new DbService();
const mauticApi = new MauticApiService();
const logger = new Logger();

const program = new Command();
program.option('-s, --source <table>', 'Source table');
program.parse(process.argv);

const { source = Source.CRM } = program.opts();

const {FETCH_LIMIT = 200} = process.env;

const exportToMautic = async (allLeads) => {
  clog('Export data to mautic...');
  const chunks = arrayChunk(allLeads, 200);
  let pageM = 1;
  for (const leads of chunks) {
    clog(`Mautic page: ${pageM} of pages ${chunks.length}`);
    pageM++;
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
        leads[index].statusCode = code;
        if ([200, 201].includes(code)) {
          // leads[index].mauticId =
          logResult.mauticId = result.contacts[index].id;
        } else if ('errors' in result) {
          const errors = [];
          // leads[index].errors = null;
          for (const field in result.errors[index].details) {
            errors.push({
              field,
              errorMessages: result.errors[index].details[field],
              mtaValue: leads[index][field],
            })
          }
          logResult.errors = errors;
          // leads[index].errors = JSON.stringify(errors);
        }
        logResult.errors !== null
          ? logger.error(JSON.stringify(logResult))
          : logger.log(JSON.stringify(logResult));
      });
    }
  }
}

const bootstrap = async () => {
  clog('Start process');
  clog('Source data:', source);
  //const csvName = path.join(__dirname, '..', `${source}_${DateTime.now().toFormat('yyyy_MM_dd_HHmmss')}.csv`);
  if (source === Source.CRM) {
    const studyTypes = await mauticApi.getFieldValues(Field.studytype);
    const scheduleConsultants = await mauticApi.getFieldValues(Field.scheduleconsultant);

    const count = await db.getCRMCount();
    clog('Count records:', count);
    const limit = Number(FETCH_LIMIT);
    const pages = 1; //Math.ceil(count / limit);
    for (let p = 0; p < pages; p++) {
      clog(`DB page: ${p + 1} of pages: ${pages}`);
      let crmData;
      try {
        clog('Getting data from DB...');
        crmData = await db.getCRMData(p * limit, limit);
      } catch (e) {
        clog('ERROR Message:', e.message);
        clog('ERROR', e);
        break;
      }
      //saveCSV(csvName, crmData);
      const allLeads = CRMToMautic(crmData).map(fields => {
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
      await exportToMautic(allLeads);
      // saveCSV(csvName, leads);
    }
    clog('Done');
  } else if (source === Source.LEADS) {
    const count = await db.getLeadsCount();
    clog('Count records:', count);
    const limit = Number(FETCH_LIMIT);
    const pages = 1; //Math.ceil(count / limit);
    for (let p = 0; p < pages; p++) {
      clog(`DB page: ${p + 1} of pages: ${pages}`);
      let leadsData;
      try {
        clog('Getting data from DB...');
        leadsData = await db.getLeadsData(p * limit, limit);
      } catch (e) {
        clog('ERROR Message:', e.message);
        clog('ERROR', e);
        break;
      }
      //saveCSV(csvName, leadsData);
      const allLeads = leadsToMautic(leadsData);
      await exportToMautic(allLeads);
    }
    clog('Done');
  } else {
    clog('ERROR: Source is not supported');
  }

}

bootstrap();
