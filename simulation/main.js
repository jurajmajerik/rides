import dbInit from './dbInit.js';
import paths from './paths.js';
import { getRoadNodes, wait, getRandomInt, decide } from './utils.js';
const db = dbInit();
import { fork } from 'child_process';

const getDestination = fork('getDestination.js');

const roadNodes = getRoadNodes().filter(coord => {
  const [x, y] = coord.split(':');
  return (x !== '0' && x !== '49' && y !== '0' && y !== '49'); // exclude edge coords for now
});

const simulateCars = () => {
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
};

class Customer {
  constructor({ name }) {
    this.refreshInterval = 500;
    this.name = name;
    this.active = false;
    this.location = null;
    this.destination = null;

    this.handleDestinationResult = this.handleDestinationResult.bind(this);

    this.simulate();
  }

  async updateDB() {
    return db.query(
      `
      INSERT INTO customers (name, active, location, destination)
      VALUES ('${this.name}', ${this.active}, '${this.location}', '${this.destination}')
      ON CONFLICT (name)
      DO UPDATE SET 
      name = EXCLUDED.name,
      active = EXCLUDED.active,
      location = EXCLUDED.location,
      destination = EXCLUDED.destination
      `
    );
  }

  async simulate() {
    while (true) {
      // Active and waiting for the destination
      if (this.active && !this.destination) {
        await wait(this.refreshInterval);
        continue;
      }

      // Decide on the new active status
      let newActive;
      if (this.active) newActive = decide(95);
      else newActive = decide(5);

      // Change of active status
      if (this.active !== newActive) {
        this.active = newActive;

        if (newActive) {
          const location = roadNodes[getRandomInt(0, roadNodes.length - 1)];
          this.location = location;

          getDestination.send({
            name: this.name,
            input: `${Date.now()}`,
          });
        } else {
          this.active = false;
          this.location = null;
          this.destination = null;
          this.updateDB();
        }
      }

      await wait(this.refreshInterval);
    }
  }

  handleDestinationResult(destination) {
    this.destination = destination;
    this.updateDB();
  }
}

const main = async () => {
  await wait (5000);

  // Simulate cards
  simulateCars();

  // Simulate customers
  const customers = {};
  ['Alice', 'Michael', 'Kate', 'Paul', 'Susan', 'Andrew'].forEach((name) => {
    customers[name] = new Customer({ name });
  });

  getDestination.on('message', ({ name, destination }) => {
    customers[name].handleDestinationResult(destination);
  });
};
main();
