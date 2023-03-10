import g from './global.js';
import Customer from './Customer.js';
import Driver from './Driver.js';
import { CoordPair } from './types.js';
import { drivers, customers } from './data.js';

const main = async () => {
  await g.init();

  const { db, getDestination, dispatcher } = g;

  await db.query('DELETE FROM drivers;');
  await db.query('DELETE FROM customers;');

  // Simulate drivers
  const driverInstances: { [driverId: string]: Driver } = {};

  drivers.forEach(({ driverId, name }) => {
    driverInstances[driverId] = new Driver({ driverId, name });
  });

  // Simulate customers
  const customerInstances: { [customerId: string]: Customer } = {};

  customers.forEach(({ customerId, name }) => {
    customerInstances[customerId] = new Customer({ customerId, name });
  });

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
    ({ customerId, driverId }: { customerId: string; driverId: string }) => {
      customerInstances[customerId].handleDispatcherResult(driverId);
    }
  );
};
main();
