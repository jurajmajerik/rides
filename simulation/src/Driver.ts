import g from './global.js';
import { wait, getRandomInt } from '../../shared/utils.js';
import { getRoadNodes } from './methods.js';
import config from '../../shared/config.js';
import { CoordPair } from './types.js';

const { refreshInterval } = config;
const roadNodes = getRoadNodes();

export default class Driver {
  private driverId: string;
  private name: string;
  location: CoordPair | null = null;
  private customerId: string | null = null;

  constructor({ driverId, name }: { driverId: string; name: string }) {
    this.driverId = driverId;
    this.name = name;
    this.location = roadNodes[getRandomInt(0, roadNodes.length - 1)];

    this.simulate();
  }

  private async updateDB(): Promise<void> {
    const dummyPath =
      this.location &&
      `[[${this.location[0]}, ${this.location[1]}], [${this.location[0] + 1}, ${
        this.location[1]
      }]]`;

    return g.db.query(
      `
      INSERT INTO drivers (driver_id, location, path)
      VALUES (
        '${this.driverId}',
        '${this.location[0]}:${this.location[1]}',
        '${dummyPath}'
      )
      ON CONFLICT (driver_id)
      DO UPDATE SET location = EXCLUDED.location, path = EXCLUDED.path;
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
    }
  }

  public handleDispatcherResult(customerId: string): void {
    this.customerId = customerId;
    this.updateDB();
  }
}
