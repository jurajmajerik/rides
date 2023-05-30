import { fork, ChildProcess } from 'child_process';
import { CoordPair } from './types.js';
import dbInit from './dbInit.js';
import Driver from './Driver.js';
import Customer from './Customer.js';
import { getRoadNodes } from './methods.js';
import { drivers, customers } from './data.js';

export interface Global {
  db: any;
  driverInstances: { [driverId: string]: Driver };
  customerInstances: { [customerId: string]: Customer };
  dispatcher: ChildProcess;
  getDestination: ChildProcess;
  routePlanner: ChildProcess;
  activeCustomers: Set<string>;
  activeDrivers: Set<string>;
  roadNodes: CoordPair[];
  init: () => Promise<void>;
}

const g: Global = {
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
  customers.forEach(({ customerId }) => {
    g.customerInstances[customerId] = new Customer({ customerId });
  });

  setInterval(() => {
    console.log(`Active drivers: ${g.activeDrivers.size}`);
    console.log(`Active customers: ${g.activeCustomers.size}`);
  }, 10000);
};

g.init = init;

export default g;
