import { fork, ChildProcess } from 'child_process';
import { CoordPair } from './types.js';
import dbInit from './dbInit.js';

export interface Global {
  db: any;
  dispatcher: ChildProcess;
  getDestination: ChildProcess;
  activeCustomers: Map<string, CoordPair>;
  init: () => Promise<void>;
}

const g: Global = {
  db: null,
  getDestination: null,
  dispatcher: null,
  activeCustomers: null,
  init: null,
};

const init = async () => {
  g.db = await dbInit();
  g.getDestination = fork('getDestination.js');
  g.dispatcher = fork('dispatcher.js');
  g.activeCustomers = new Map();
};

g.init = init;

export default g;
