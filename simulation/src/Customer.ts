import g from './global.js';
import { wait, getRandomInt, decide } from '../../shared/utils.js';
import { CoordPair } from './types.js';
import config from '../../shared/config.js';

const { maxActiveCustomers } = config;

export default class Customer {
  private busy = false;

  public customerId: string;
  public name: string;
  public active = false;
  public location: CoordPair | null = null;
  public destination: CoordPair | null = null;
  private driverId: string | null = null;

  constructor({ customerId, name }: { customerId: string; name: string }) {
    this.customerId = customerId;
    this.name = name;

    this.deactivate = this.deactivate.bind(this);
    this.handleDestinationResult = this.handleDestinationResult.bind(this);

    this.simulate();
  }

  private async updateDB(): Promise<void> {
    return g.db.query(
      `
      INSERT INTO customers (customer_id, name, active, location, destination, driver_id)
      VALUES (
        '${this.customerId}',
        '${this.name}',
        ${this.active},
        '${this.location && `${this.location[0]}:${this.location[1]}`}',
        '${
          this.destination && `${this.destination[0]}:${this.destination[1]}`
        }',
        ${this.driverId ? `'${this.driverId}'` : null}
      )
      ON CONFLICT (name)
      DO UPDATE SET 
      name = EXCLUDED.name,
      active = EXCLUDED.active,
      location = EXCLUDED.location,
      destination = EXCLUDED.destination,
      driver_id = EXCLUDED.driver_id
      `
    );
  }

  public deactivate(): void {
    g.activeCustomers.delete(this.customerId);

    this.active = false;
    this.location = null;
    this.destination = null;
    this.driverId = null;
    this.updateDB();
  }

  private async simulate(): Promise<void> {
    // Refresh every 200ms
    while (true) {
      await wait(200);

      // Only make new decisions if not currently waiting for a result
      // of an asynchronous operation
      if (!this.busy) {
        // Not active, reactivate with some probability
        if (!this.active) {
          if (g.activeCustomers.size < maxActiveCustomers) {
            let newActive = false;
            newActive = decide(5);
            if (newActive) {
              this.active = true;
              this.updateDB();
            }
          }
        } else if (this.active && !this.location) {
          // No location yet -> set location, request destination
          this.busy = true;

          const location = g.roadNodes[getRandomInt(0, g.roadNodes.length - 1)];
          this.location = location;
          g.activeCustomers.set(this.customerId, location);

          g.getDestination.send({
            customerId: this.customerId,
            location: this.location,
          });
        } else if (this.active && !this.driverId) {
          // Match with a driver
          this.busy = true;
          g.dispatcher.send({
            from: 'customer',
            data: {
              customerId: this.customerId,
              name: this.name,
              location: this.location,
            },
          });
        }
      }
    }
  }

  public handleDestinationResult(destination: CoordPair): void {
    this.destination = destination;
    this.busy = false;
    this.updateDB();
  }

  public handleDispatcherResult(driverId: string): void {
    this.driverId = driverId;
    this.busy = false;
    this.updateDB();
  }
}
