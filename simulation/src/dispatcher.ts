import { wait } from '../../shared/utils.js';
import { CoordPair } from './types.js';
import { getStraightLineDistance } from './methods.js';

interface CustomerData {
  customerId: string;
  name: string;
  location: CoordPair;
}

interface DriverData {
  driverId: string;
  name: string;
  location: CoordPair;
}

interface Message {
  from: string;
  data: CustomerData | DriverData;
}

const customerQueue: {
  customerId: string;
  name: string;
  location: CoordPair;
}[] = [];
const drivers: { driverId: string; name: string; location: CoordPair }[] = [];

process.on('message', ({ from, data }: Message) => {
  if (from === 'customer') {
    const { customerId, name, location } = data as CustomerData;
    customerQueue.push({ customerId, name, location });
  } else if (from === 'driver') {
    const { driverId, name, location } = data as DriverData;
    drivers.push({ driverId, name, location });
  }
});

const main = async () => {
  await wait(5000);

  while (true) {
    await wait(500);
    if (customerQueue.length && drivers.length) {
      const { customerId, location } = customerQueue.shift();

      drivers.sort((driverA, driverB) => {
        return (
          getStraightLineDistance(driverB.location, location) -
          getStraightLineDistance(driverA.location, location)
        );
      });

      const matchedDriver = drivers.pop();
      const { driverId } = matchedDriver;

      process.send({ customerId, driverId, location });
    }

    if (customerQueue.length) continue;
    else await wait(1000);
  }
};
main();
