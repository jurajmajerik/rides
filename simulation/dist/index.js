import dbInit from './dbInit.js';
import paths from './paths.js';
import { wait, getRandomInt, decide } from '../../shared/utils.js';
import { getRoadNodes } from './methods.js';
import { fork } from 'child_process';
import config from '../../shared/config.js';
const { gridCount } = config;
let db;
const getDestination = fork('getDestination.js');
const roadNodes = getRoadNodes().filter(([x, y]) => {
    return x !== 0 && x !== gridCount - 1 && y !== 0 && y !== gridCount - 1;
});
const simulateCars = () => {
    const cycle = async (pathObj) => {
        while (true) {
            const { carId, i, selected } = pathObj;
            const path = pathObj[selected];
            const [x, y] = path[i];
            db.query(`
        INSERT INTO rides (car_id, location, path)
        VALUES (
          '${carId}',
          '${x}:${y}',
          '${JSON.stringify(path)}'
        )
        ON CONFLICT (car_id)
        DO UPDATE SET location = EXCLUDED.location, path = EXCLUDED.path;
        `);
            if (i === path.length - 1) {
                pathObj.selected = selected === 'first' ? 'second' : 'first';
                pathObj.i = 0;
                await wait(3000);
            }
            else {
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
        this.active = false;
        this.location = null;
        this.destination = null;
        this.name = name;
        this.handleDestinationResult = this.handleDestinationResult.bind(this);
        this.simulate();
    }
    async updateDB() {
        return db.query(`
      INSERT INTO customers (name, active, location, destination)
      VALUES (
        '${this.name}',
        ${this.active},
        '${this.location && `${this.location[0]}:${this.location[1]}`}',
        '${this.destination && `${this.destination[0]}:${this.destination[1]}`}'
      )
      ON CONFLICT (name)
      DO UPDATE SET 
      name = EXCLUDED.name,
      active = EXCLUDED.active,
      location = EXCLUDED.location,
      destination = EXCLUDED.destination
      `);
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
            if (this.active)
                newActive = decide(95);
            else
                newActive = decide(5);
            // Change of active status
            if (this.active !== newActive) {
                this.active = newActive;
                if (newActive) {
                    const location = roadNodes[getRandomInt(0, roadNodes.length - 1)];
                    this.location = location;
                    getDestination.send({
                        name: this.name,
                        location,
                    });
                }
                else {
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
    db = await dbInit();
    // Simulate cars
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
//# sourceMappingURL=index.js.map