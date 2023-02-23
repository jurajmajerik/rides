import dbInit from './dbInit.js';
import paths from './paths.js';
import { getRoadNodes, wait, getRandomInt, decide } from './utils.js';
const db = dbInit();

const roadNodes = getRoadNodes().filter(coord => {
  const [x, y] = coord.split(':');
  return (x !== '0' && x !== '49' && y !== '0' && y !== '49'); // exclude edge coords for now
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
      if (this.active) newActive = decide(95);
      else newActive = decide(5);

      if (this.active !== newActive) {
        if (newActive) {
          const location = roadNodes[getRandomInt(0, roadNodes.length - 1)];
          this.location = location;
        }

        this.active = newActive;
        const res = await db.query(
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

      const res = await db.query(
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
