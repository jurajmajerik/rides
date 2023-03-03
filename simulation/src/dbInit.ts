import fs from 'fs';
import pg from 'pg';

export default function dbInit() {
  const dbConfig = JSON.parse(fs.readFileSync('../../dbconfig.json', 'utf8'));
  const { host, port, user, password, dbname } = dbConfig;
  const { Client } = pg;
  const db = new Client({ host, port, user, password, database: dbname });
  db.connect((err) => {
    if (err) console.error('connection error', err.stack);
    else console.log('connected');
  });

  return db;
}
