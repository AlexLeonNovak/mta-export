import * as fs from 'fs';

export const saveCSV = (filename: string, data: Record<string, string>[]) => {
  let isNewFile = false;
  if (!fs.existsSync(filename)) {
    isNewFile = true;
  }
  const stream = fs.createWriteStream(filename);
  for (let i of data) {
    if (isNewFile) {
      stream.write(Object.keys(i).join(",") + "\r\n");
      isNewFile = false;
    }
    stream.write(Object.values(i).join(",") + "\r\n");
  }
  stream.end();
}
