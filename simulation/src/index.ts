import g from './global.js';
import Customer from './Customer.js';
import { CoordPair, Path } from './types.js';

const main = async () => {
  await g.init();

  const {
    db,
    driverInstances,
    customerInstances,
    getDestination,
    dispatcher,
    routePlanner,
  } = g;

  await db.query('DELETE FROM drivers;');
  await db.query('DELETE FROM customers;');

  getDestination.on(
    'message',
    ({
      customerId,
      destination,
    }: {
      customerId: string;
      destination: CoordPair;
    }) => {
      customerInstances[customerId].handleDestinationResult(destination);
    }
  );

  dispatcher.on(
    'message',
    ({
      customerId,
      driverId,
      location,
    }: {
      customerId: string;
      driverId: string;
      location: CoordPair;
    }) => {
      customerInstances[customerId].handleDispatcherResult(driverId);
      driverInstances[driverId].handleDispatcherResult(customerId, location);
    }
  );

  routePlanner.on(
    'message',
    ({ driverId, path }: { driverId: string; path: Path }) => {
      driverInstances[driverId].handleRoutePlannerResult(path);
    }
  );
};
main();
