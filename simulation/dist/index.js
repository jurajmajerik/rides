import dbInit from './dbInit.js';
import { wait, getRandomInt, decide } from '../../shared/utils.js';
import { getRoadNodes } from './methods.js';
import { fork } from 'child_process';
import config from '../../shared/config.js';
import { drivers, customers } from './data.js';
const { maxActiveCustomers, refreshInterval } = config;
const roadNodes = getRoadNodes();
let db;
const getDestination = fork('getDestination.js');
const dispatcher = fork('dispatcher.js');
class Driver {
    constructor({ driverId, name }) {
        this.location = null;
        this.driverId = driverId;
        this.name = name;
        this.location = roadNodes[getRandomInt(0, roadNodes.length - 1)];
        this.simulate();
    }
    async updateDB() {
        const dummyPath = this.location &&
            `[[${this.location[0]}, ${this.location[1]}], [${this.location[0] + 1}, ${this.location[1]}]]`;
        return db.query(`
      INSERT INTO drivers (driver_id, location, path)
      VALUES (
        '${this.driverId}',
        '${this.location[0]}:${this.location[1]}',
        '${dummyPath}'
      )
      ON CONFLICT (driver_id)
      DO UPDATE SET location = EXCLUDED.location, path = EXCLUDED.path;
      `);
    }
    async simulate() {
        dispatcher.send({
            from: 'driver',
            data: { driverId: this.driverId, location: this.location },
        });
        this.updateDB();
        while (true) {
            await wait(refreshInterval);
        }
    }
}
class Customer {
    constructor({ customerId, name }) {
        this.active = false;
        this.location = null;
        this.destination = null;
        this.driverId = null;
        this.customerId = customerId;
        this.name = name;
        this.handleDestinationResult = this.handleDestinationResult.bind(this);
        this.simulate();
    }
    async updateDB() {
        return db.query(`
      INSERT INTO customers (customer_id, name, active, location, destination)
      VALUES (
        '${this.customerId}',
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
                await wait(refreshInterval);
                continue;
            }
            // Decide on the new active status
            let newActive = this.active;
            // If inactive, decide if to become active
            if (!this.active && activeCustomers.size < maxActiveCustomers) {
                newActive = decide(5);
            }
            // Change of active status
            if (this.active !== newActive) {
                this.active = newActive;
                if (newActive) {
                    // Became active -> decide on the destination
                    const location = roadNodes[getRandomInt(0, roadNodes.length - 1)];
                    this.location = location;
                    activeCustomers.set(this.customerId, location);
                    getDestination.send({
                        customerId: this.customerId,
                        location,
                    });
                }
                else {
                    // Just became inactive -> clear state
                    activeCustomers.delete(this.customerId);
                    this.active = false;
                    this.location = null;
                    this.destination = null;
                    this.updateDB();
                }
            }
            // Match with a driver
            if (this.active && this.destination && !this.driverId) {
                dispatcher.send({
                    from: 'customer',
                    data: { customerId: this.customerId, location },
                });
            }
            await wait(refreshInterval);
        }
    }
    handleDestinationResult(destination) {
        this.destination = destination;
        this.updateDB();
    }
    handleDispatcherResult(driverId) {
        this.driverId = driverId;
        this.updateDB();
    }
}
const activeCustomers = new Map();
const availableDrivers = new Map();
const main = async () => {
    db = await dbInit();
    await db.query('DELETE FROM drivers;');
    await db.query('DELETE FROM customers;');
    // Simulate drivers
    const driverInstances = {};
    drivers.forEach(({ driverId, name }) => {
        driverInstances[driverId] = new Driver({ driverId, name });
    });
    // Simulate customers
    const customerInstances = {};
    customers.forEach(({ customerId, name }) => {
        customerInstances[customerId] = new Customer({ customerId, name });
    });
    getDestination.on('message', ({ customerId, destination, }) => {
        customerInstances[customerId].handleDestinationResult(destination);
    });
    dispatcher.on('message', ({ customerId, driverId }) => {
        customerInstances[customerId].handleDispatcherResult(driverId);
    });
};
main();
//# sourceMappingURL=index.js.map