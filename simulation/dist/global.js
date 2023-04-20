import { fork } from 'child_process';
import dbInit from './dbInit.js';
import Driver from './Driver.js';
import Customer from './Customer.js';
import { getRoadNodes } from './methods.js';
import { drivers, customers } from './data.js';
const g = {
    db: null,
    driverInstances: null,
    customerInstances: null,
    getDestination: null,
    dispatcher: null,
    routePlanner: null,
    activeCustomers: null,
    activeDrivers: null,
    roadNodes: null,
    init: null,
};
const init = async () => {
    g.db = await dbInit();
    g.getDestination = fork('getDestination.js');
    g.dispatcher = fork('dispatcher.js');
    g.routePlanner = fork('routePlanner.js');
    g.activeCustomers = new Set();
    g.activeDrivers = new Set();
    g.roadNodes = getRoadNodes();
    g.driverInstances = {};
    drivers.forEach(({ driverId }) => {
        g.driverInstances[driverId] = new Driver({ driverId });
    });
    g.customerInstances = {};
    customers.forEach(({ customerId, name }) => {
        g.customerInstances[customerId] = new Customer({ customerId, name });
    });
    setInterval(() => {
        console.log(g.activeDrivers);
    }, 10000);
};
g.init = init;
export default g;
//# sourceMappingURL=global.js.map