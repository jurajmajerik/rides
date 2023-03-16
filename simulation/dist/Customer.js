import g from './global.js';
import { wait, getRandomInt, decide } from '../../shared/utils.js';
import { getRoadNodes } from './methods.js';
import config from '../../shared/config.js';
const { maxActiveCustomers, refreshInterval } = config;
const roadNodes = getRoadNodes();
export default class Customer {
    constructor({ customerId, name }) {
        this.busy = false;
        this.active = false;
        this.location = null;
        this.destination = null;
        this.driverId = null;
        this.deactivate = () => {
            g.activeCustomers.delete(this.customerId);
            this.active = false;
            this.location = null;
            this.destination = null;
            this.updateDB();
        };
        this.customerId = customerId;
        this.name = name;
        // this.deactivate = this.deactivate.bind(this);
        this.handleDestinationResult = this.handleDestinationResult.bind(this);
        this.simulate();
    }
    isNotMatched() {
        return this.active && this.destination && !this.driverId;
    }
    async updateDB() {
        return g.db.query(`
      INSERT INTO customers (customer_id, name, active, location, destination, driver_id)
      VALUES (
        '${this.customerId}',
        '${this.name}',
        ${this.active},
        '${this.location && `${this.location[0]}:${this.location[1]}`}',
        '${this.destination && `${this.destination[0]}:${this.destination[1]}`}',
        ${this.driverId ? `'${this.driverId}'` : null}
      )
      ON CONFLICT (name)
      DO UPDATE SET 
      name = EXCLUDED.name,
      active = EXCLUDED.active,
      location = EXCLUDED.location,
      destination = EXCLUDED.destination,
      driver_id = EXCLUDED.driver_id
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
            if (!this.active && g.activeCustomers.size < maxActiveCustomers) {
                newActive = decide(5);
            }
            // Change of active status
            if (this.active !== newActive) {
                this.active = newActive;
                if (newActive) {
                    // Became active -> decide on the destination
                    const location = roadNodes[getRandomInt(0, roadNodes.length - 1)];
                    this.location = location;
                    g.activeCustomers.set(this.customerId, location);
                    g.getDestination.send({
                        customerId: this.customerId,
                        location,
                    });
                }
                else {
                    g.activeCustomers.delete(this.customerId);
                    this.active = false;
                    this.location = null;
                    this.destination = null;
                    this.updateDB();
                }
            }
            if (!this.busy) {
                // Match with a driver
                if (this.isNotMatched()) {
                    this.busy = true;
                    console.log('e', this);
                    g.dispatcher.send({
                        from: 'customer',
                        entity: this,
                    });
                }
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
        this.busy = false;
        this.updateDB();
    }
}
//# sourceMappingURL=Customer.js.map