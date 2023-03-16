import g from './global.js';
const main = async () => {
    await g.init();
    const { db, driverInstances, customerInstances, getDestination, dispatcher, routePlanner, } = g;
    await db.query('DELETE FROM drivers;');
    await db.query('DELETE FROM customers;');
    getDestination.on('message', ({ customerId, destination, }) => {
        customerInstances[customerId].handleDestinationResult(destination);
    });
    dispatcher.on('message', ({ customerId, driverId, location, }) => {
        customerInstances[customerId].handleDispatcherResult(driverId);
        driverInstances[driverId].handleDispatcherResult(customerId, location);
    });
    routePlanner.on('message', ({ driverId, path }) => {
        driverInstances[driverId].handleRoutePlannerResult(path);
    });
};
main();
//# sourceMappingURL=index.js.map