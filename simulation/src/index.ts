import dbInit from './dbInit.js';
import paths from './paths.js';
import { wait, getRandomInt, decide } from '../../shared/utils.js';
import { getRoadNodes } from './methods.js';
import { fork, ChildProcess } from 'child_process';
import config from '../../shared/config.js';
const { gridCount } = config;

let db;

const getDestination: ChildProcess = fork('getDestination.js');

const roadNodes: string[] = getRoadNodes().filter((coord: string) => {
  const [x, y] = coord.split(':');
  return (
    x !== '0' &&
    x !== (gridCount - 1).toString() &&
    y !== '0' &&
    y !== (gridCount - 1).toString()
  );
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
  private refreshInterval = 500;
  private name: string;
  private active = false;
  private location: string | null = null;
  private destination: string | null = null;

  constructor({ name }: { name: string }) {
    this.name = name;
    this.handleDestinationResult = this.handleDestinationResult.bind(this);

    this.simulate();
  }

  private async updateDB(): Promise<void> {
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

  private async simulate(): Promise<void> {
    while (true) {
      // Active and waiting for the destination
      if (this.active && !this.destination) {
        await wait(this.refreshInterval);
        continue;
      }

      // Decide on the new active status
      let newActive: boolean;
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

  public handleDestinationResult(destination: string): void {
    this.destination = destination;
    this.updateDB();
  }
}

const main = async () => {
  db = await dbInit();

  // Simulate cars
  simulateCars();

  // Simulate customers
  const customers = {};
  ['Alice', 'Michael', 'Kate', 'Paul', 'Susan', 'Andrew'].forEach((name) => {
    customers[name] = new Customer({ name });
  });

  getDestination.on(
    'message',
    ({ name, destination }: { name: string; destination: string }) => {
      customers[name].handleDestinationResult(destination);
    }
  );
};
main();
