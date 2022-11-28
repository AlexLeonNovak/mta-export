import { DateTime } from "luxon";

export const clog = (...message) => console.log(DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'), ...message);