import g from './global.js';
import { wait, getRandomInt } from '../../shared/utils.js';
import { CoordPair, Path } from './types.js';

export default class Driver {
  private busy = false;

  public driverId: string;
  public name: string;
  private status: 'idle' | 'pickup' | 'enroute' = 'idle';
  public location: CoordPair | null = null;
  private customerId: string | null = null;
  private customerLocation: CoordPair | null = null;
  private path: Path | null = null;
  private pathIndex: number | null = null;

  constructor({ driverId, name }: { driverId: string; name: string }) {
    this.driverId = driverId;
    this.name = name;
    this.location = g.roadNodes[getRandomInt(0, g.roadNodes.length - 1)];

    this.handleDispatcherResult = this.handleDispatcherResult.bind(this);
    this.handleRoutePlannerResult = this.handleRoutePlannerResult.bind(this);

    this.updateDB();
    this.simulate();
  }

  private async updateDB(): Promise<void> {
    return g.db.query(
      `
      INSERT INTO drivers (driver_id, name, status, location, path, path_index, customer_id)
      VALUES (
        '${this.driverId}',
        '${this.name}',
        '${this.status}',
        '${this.location[0]}:${this.location[1]}',
        ${this.path ? `'${JSON.stringify(this.path)}'` : null},
        ${this.pathIndex ? `'${this.pathIndex}'` : null},
        ${this.customerId ? `'${this.customerId}'` : null}
      )
      ON CONFLICT (driver_id)
      DO UPDATE SET
      name = EXCLUDED.name,
      status = EXCLUDED.status,
      location = EXCLUDED.location,
      path = EXCLUDED.path,
      path_index = EXCLUDED.path_index,
      customer_id = EXCLUDED.customer_id
      `
    );
  }

  isDestinationReached(): boolean {
    const { path, location } = this;
    return (
      location[0] === path[path.length - 1][0] &&
      location[1] === path[path.length - 1][1]
    );
  }

  requestMatch() {
    g.dispatcher.send({
      from: 'driver',
      data: {
        driverId: this.driverId,
        name: this.name,
        location: this.location,
      },
    });
  }

  requestRoute(destination) {
    g.routePlanner.send({
      driverId: this.driverId,
      startingPosition: this.location,
      destination,
    });
  }

  private simulate = async (): Promise<void> => {
    while (true) {
      await wait(200);

      if (!this.busy) {
        if (!this.customerId) {
          // Match with a customer
          this.busy = true;
          this.requestMatch();
        } else if (this.customerId && !this.path) {
          // Request path to the customer
          this.busy = true;
          this.requestRoute(this.customerLocation);
        } else if (this.path && !this.isDestinationReached()) {
          // Move to next location on the path
          this.pathIndex++;
          this.location = this.path[this.pathIndex];

          this.updateDB();
        } else if (this.path && this.isDestinationReached()) {
          if (this.status === 'pickup') {
            // Customer reached, request route towards customer's destination
            await wait(3000);

            this.busy = true;
            const customerDestination =
              g.customerInstances[this.customerId].destination;
            this.requestRoute(customerDestination);
          } else if (this.status === 'enroute') {
            // Customer's destination reached, reset state, deactivate customer
            await wait(3000);

            g.customerInstances[this.customerId].deactivate();

            this.status = 'idle';
            this.customerId = null;
            this.path = null;
            this.pathIndex = null;
            this.updateDB();

            await wait(2000);
          }
        }
      }
    }
  };

  public handleDispatcherResult(
    customerId: string,
    customerLocation: CoordPair
  ): void {
    this.customerId = customerId;
    this.customerLocation = customerLocation;
    this.updateDB();
    this.busy = false;
  }

  public handleRoutePlannerResult(path: Path): void {
    let newStatus;
    if (this.status === 'idle') newStatus = 'pickup';
    else if (this.status === 'pickup') newStatus = 'enroute';

    this.status = newStatus;

    this.path = path;
    this.pathIndex = 0;
    this.updateDB();
    this.busy = false;
  }
}
