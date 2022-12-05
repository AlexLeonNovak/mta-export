import 'dotenv/config';
import {Command} from 'commander';
import {DbService} from './services/db.service';
import {Field, MauticApiService} from './services/mautic-api.service';
import {CRMToMautic, leadsToMautic} from './utils/data.adapter';
import {Logger} from './utils/logger';
import {clog} from './utils/clog';
import {arrayChunk} from './utils/chunk.array';
import {DateTime} from 'luxon';
import * as path from 'path';
import {saveCSV} from './services/csv.service';

const db = new DbService();
const mauticApi = new MauticApiService();
const logger = new Logger();

const program = new Command();
program.option('-d, --fromDate <date>', 'Export items starting from date');
program.parse(process.argv);

const {
  fromDate = DateTime.now().minus({days: 1}).toFormat('yyyy-MM-dd'),
} = program.opts();


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
  clog('From date:', fromDate);

  const studyTypes = await mauticApi.getFieldValues(Field.studytype);
  const scheduleConsultants = await mauticApi.getFieldValues(Field.scheduleconsultant);

  const crmCount = await db.getCRMCount(fromDate);
  clog('CRM count records:', crmCount);
  let crmData;
  try {
    clog('Getting data from DB...');
    crmData = await db.getCRMData(fromDate);
  } catch (e) {
    clog('ERROR Message:', e.message);
    clog('ERROR', e);
    process.exit();
  }
  let csvName = path.join(__dirname, '..', `crm_${DateTime.now().toFormat('yyyy_MM_dd_HHmmss')}.csv`);
  saveCSV(csvName, crmData);
  const crmFields = CRMToMautic(crmData).map(fields => {
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

  const leadsCount = await db.getLeadsCount(fromDate);
  clog('Leads count records:', leadsCount);
  let leadsData;
  try {
    clog('Getting data from DB...');
    leadsData = await db.getLeadsData(fromDate);
  } catch (e) {
    clog('ERROR Message:', e.message);
    clog('ERROR', e);
    process.exit();
  }
  csvName = path.join(__dirname, '..', `leads_${DateTime.now().toFormat('yyyy_MM_dd_HHmmss')}.csv`);
  saveCSV(csvName, leadsData);
  const leadFields = leadsToMautic(leadsData);
  const allLeads = [...crmFields, ...leadFields];
  clog('Total count:', allLeads.length);
  await exportToMautic(allLeads);
  clog('Done');
}

bootstrap();
