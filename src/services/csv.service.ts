import * as fs from 'fs';
import {stringify} from 'csv-stringify/sync';

export const saveCSV = (filename: string, data: Record<string, string>[]) => {
  const csv = stringify(data, {
    header: !fs.existsSync(filename)
  });
  fs.appendFileSync(filename, csv);
}
