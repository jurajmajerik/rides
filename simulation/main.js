const fs = require('fs');
const { Client } = require('pg');
const dbConfig = JSON.parse(fs.readFileSync('../dbconfig.json', 'utf8'));
const paths = require('./paths');

const wait = (t) => new Promise((res) => {
  setTimeout(() => {
    res();
  }, t);
});

const main = async () => {
  await wait (5000);

  const { host, port, user, password, dbname } = dbConfig;
  const client = new Client({ host, port, user, password, database: dbname });

  client.connect((err) => {
    if (err) console.error('connection error', err.stack);
    else console.log('connected');
  });

  const cycle = async (pathObj) => {
    while (true) {
      const { carId, i, selected } = pathObj;
      const path = pathObj[selected];
      const [x, y] = path[i];

      const res = await client.query(
        `
        INSERT INTO rides (car_id, location, path) 
        VALUES ('${carId}', '${x}:${y}', '${JSON.stringify(path)}')
        ON CONFLICT (car_id) 
        DO UPDATE SET location = EXCLUDED.location, path = EXCLUDED.path;
        `
      );

      if (i === path.length - 1) {
        pathObj.selected = selected === 'first' ? 'second' : 'first';
        pathObj.i = 0;
        await wait(3000);
      } else {
        pathObj.i++;
      }

      await wait(200);
    }    
  };

  for (const pathObj of paths) {
    cycle(pathObj);
  }
};
main();
