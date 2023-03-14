import g from './global.js';
import { wait, getRandomInt } from '../../shared/utils.js';
import { getRoadNodes } from './methods.js';
import config from '../../shared/config.js';
import { CoordPair, Path } from './types.js';

const { refreshInterval } = config;
const roadNodes = getRoadNodes();

export default class Driver {
  private busy = false;

  private driverId: string;
  private name: string;
  private location: CoordPair | null = null;
  private customerId: string | null = null;
  private customerLocation: CoordPair | null = null;
  private path: Path | null = null;

  constructor({ driverId, name }: { driverId: string; name: string }) {
    this.driverId = driverId;
    this.name = name;
    this.location = roadNodes[getRandomInt(0, roadNodes.length - 1)];

    this.simulate();
  }

  private async updateDB(): Promise<void> {
    console.log(this.path);

    return g.db.query(
      `
      INSERT INTO drivers (driver_id, location, path, customer_id)
      VALUES (
        '${this.driverId}',
        '${this.location[0]}:${this.location[1]}',
        ${this.path ? `'${JSON.stringify(this.path)}'` : null},
        ${this.customerId ? `'${this.customerId}'` : null}
      )
      ON CONFLICT (driver_id)
      DO UPDATE SET
      location = EXCLUDED.location,
      path = EXCLUDED.path,
      customer_id = EXCLUDED.customer_id
      `
    );
  }

  private async simulate(): Promise<void> {
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
        if (this.customerId && this.customerLocation && !this.path) {
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

  public handleDispatcherResult(
    customerId: string,
    customerLocation: CoordPair
  ): void {
    this.customerId = customerId;
    this.customerLocation = customerLocation;
    this.updateDB();
  }

  public handleRoutePlannerResult(path: Path): void {
    this.busy = false;
    this.path = path;
    this.updateDB();
  }
}
