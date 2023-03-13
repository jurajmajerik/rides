import g from './global.js';
import Customer from './Customer.js';
import Driver from './Driver.js';
import { drivers, customers } from './data.js';
const main = async () => {
    await g.init();
    const { db, getDestination, dispatcher, routePlanner } = g;
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
        driverInstances[driverId].handleDispatcherResult(customerId);
    });
    routePlanner.on('message', ({ driverId, path }) => {
        driverInstances[driverId].handleRoutePlannerResult(path);
    });
};
main();
//# sourceMappingURL=index.js.map