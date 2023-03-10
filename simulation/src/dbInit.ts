import fs from 'fs';
//@ts-ignore
import pg, { Client } from 'pg';
import { wait } from '../../shared/utils.js';

let retries = 3;
const retryDelay = 2000;

export default async function dbInit(): Promise<Client> {
  return new Promise(async (resolve, reject) => {
    const dbConfig = JSON.parse(fs.readFileSync('../../dbconfig.json', 'utf8'));
    const { host, port, user, password, dbname } = dbConfig;
    const { Client } = pg;
    const db = new Client({ host, port, user, password, database: dbname });

    while (retries > 0) {
      try {
        await db.connect();
        console.log('DB connected');
        resolve(db);
        return;
      } catch (err) {
        console.error(`Connection error: ${JSON.stringify(err.stack)}`);
      }
      retries--;
      console.log(`Connection failed, retries remaining: ${retries}`);
      await wait(retryDelay);
    }

    reject(new Error('Failed to connect to database'));
  });
}
