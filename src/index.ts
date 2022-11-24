import 'dotenv/config';
import {DbService} from './services/db.service';
import { MauticApiService } from './services/mautic-api.service';
import { arrayChunk } from './utils/chunk.array';
import { toMautic } from './utils/data.adapter';

const bootstrap = async () => {
  try {
  const db = new DbService();
  const result = await db.getCRMData(0, 100);
  const mauticApi = new MauticApiService();
  const allLeads = Object.values(result).map(toMautic);
  const chunks = arrayChunk(allLeads, 200);
  for (const leads of chunks) {
    const data = await mauticApi.batchCreateLeads(leads);
    console.log(data);
  }
  } catch(e) {
    console.error(e);
  }
}

bootstrap();
