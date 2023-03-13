import g from './global.js';
import { wait, getRandomInt } from '../../shared/utils.js';
import { getRoadNodes } from './methods.js';
import config from '../../shared/config.js';
const { refreshInterval } = config;
const roadNodes = getRoadNodes();
export default class Driver {
    constructor({ driverId, name }) {
        this.busy = false;
        this.location = null;
        this.customerId = null;
        this.customerLocation = null;
        this.path = null;
        this.driverId = driverId;
        this.name = name;
        this.location = roadNodes[getRandomInt(0, roadNodes.length - 1)];
        this.simulate();
    }
    async updateDB() {
        const dummyPath = this.location &&
            `[[${this.location[0]}, ${this.location[1]}], [${this.location[0] + 1}, ${this.location[1]}]]`;
        return g.db.query(`
      INSERT INTO drivers (driver_id, location, path, customer_id)
      VALUES (
        '${this.driverId}',
        '${this.location[0]}:${this.location[1]}',
        ${this.path ? `'${this.path}'` : null},
        ${this.customerId ? `'${this.customerId}'` : null}
      )
      ON CONFLICT (driver_id)
      DO UPDATE SET
      location = EXCLUDED.location,
      path = EXCLUDED.path,
      customer_id = EXCLUDED.customer_id
      `);
    }
    async simulate() {
        g.dispatcher.send({
            from: 'driver',
            data: {
                driverId: this.driverId,
                name: this.name,
                location: this.location,
            },
        });
        this.updateDB();
        while (true) {
            await wait(refreshInterval);
            if (!this.busy) {
                // Request path if not already requested
                if (this.customerId && !this.customerLocation) {
                    this.busy = true;
                    g.routePlanner.send({
                        driverId: this.driverId,
                        startingPosition: this.location,
                        destination: this.customerLocation,
                    });
                }
            }
        }
    }
    handleDispatcherResult(customerId) {
        this.customerId = customerId;
        this.updateDB();
    }
    handleRoutePlannerResult(path) {
        this.path = path;
        this.updateDB();
    }
}
//# sourceMappingURL=Driver.js.map