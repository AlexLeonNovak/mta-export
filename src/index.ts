import 'dotenv/config';
import {DbService} from './services/db.service';

const bootstrap = async () => {
  const db = new DbService();
  const res = await db.getData('GilboaNet');
  console.log(res);
}

bootstrap();
