const fs = require('fs');
const { Client } = require('pg');
const dbConfig = JSON.parse(fs.readFileSync('../dbconfig.json', 'utf8'));
const paths = require('./paths');
const obstacles = require('../_config/obstacles.js');

const wait = (t) => new Promise((res) => {
  setTimeout(() => {
    res();
  }, t);
});

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min) + min);
const decide = probability => getRandomInt(1, 100) < probability;

const { host, port, user, password, dbname } = dbConfig;
const client = new Client({ host, port, user, password, database: dbname });

const coordsToObstacles = {};
obstacles.forEach(([xStart, xEnd, yStart, yEnd, color]) => {
  let x = xStart;
  while (x <= xEnd) {
    let y = yStart;
    while (y <= yEnd) {
      coordsToObstacles[`${x}:${y}`] = true;
      y += 1;
    }
    x += 1;
  }
});

const roadNodes = [];
for (let x = 0; x < 50; x++) {
  for (let y = 0; y < 50; y++) {
    if (!coordsToObstacles[`${x}:${y}`]) {
      roadNodes.push(`${x}:${y}`);
    }
  }
}

client.connect((err) => {
  if (err) console.error('connection error', err.stack);
  else console.log('connected');
});

class Customer {
  constructor({ name }) {
    this.refreshInterval = 500;
    this.name = name;
    this.active = false;
    this.location = null;
    this.simulate();
  }

  async simulate() {
    while (true) {
      let newActive;
      if (this.active) newActive = decide(90);
      else newActive = decide(10);

      if (this.active !== newActive) {
        if (newActive) {
          const location = roadNodes[getRandomInt(0, roadNodes.length - 1)];
          this.location = location;
        }

        this.active = newActive;
        const res = await client.query(
          `
          INSERT INTO customers (name, active, location)
          VALUES ('${this.name}', ${this.active}, '${this.location}')
          ON CONFLICT (name)
          DO UPDATE SET name = EXCLUDED.name, active = EXCLUDED.active, location = EXCLUDED.location;
          `
        );

        if (!res.rowCount || res.rowCount !== 1) console.error(res);
      }
      await wait(this.refreshInterval);
    }
  }
}

const main = async () => {
  await wait (5000);

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
      if (!res.rowCount || res.rowCount !== 1) console.error(res);

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

  // Simulate customers
  ['Alice', 'Michael', 'Kate', 'Paul', 'Susan', 'Andrew'].forEach((name) => {
    new Customer({ name });
  });
};
main();
