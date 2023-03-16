import { fork } from 'child_process';
import dbInit from './dbInit.js';
import Driver from './Driver.js';
import Customer from './Customer.js';
import { drivers, customers } from './data.js';
const g = {
    db: null,
    driverInstances: null,
    customerInstances: null,
    getDestination: null,
    dispatcher: null,
    routePlanner: null,
    activeCustomers: null,
    init: null,
};
const init = async () => {
    g.db = await dbInit();
    g.getDestination = fork('getDestination.js');
    g.dispatcher = fork('dispatcher.js');
    g.routePlanner = fork('routePlanner.js');
    g.activeCustomers = new Map();
    g.driverInstances = {};
    drivers.forEach(({ driverId, name }) => {
        g.driverInstances[driverId] = new Driver({ driverId, name });
    });
    g.customerInstances = {};
    customers.forEach(({ customerId, name }) => {
        g.customerInstances[customerId] = new Customer({ customerId, name });
    });
};
g.init = init;
export default g;
//# sourceMappingURL=global.js.map