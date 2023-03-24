import { wait } from '../../shared/utils.js';
import { getShortestPath } from './methods.js';
import { CoordPair } from './types.js';

interface Message {
  driverId: string;
  startingPosition: CoordPair;
  destination: CoordPair;
}

const queue: Message[] = [];

process.on(
  'message',
  ({ driverId, startingPosition, destination }: Message) => {
    queue.push({ driverId, startingPosition, destination });
  }
);

const main = async () => {
  while (true) {
    if (queue.length) {
      const { driverId, startingPosition, destination } = queue.shift();
      let path = getShortestPath(startingPosition, destination);

      process.send({ driverId, path });
    }

    if (queue.length) continue;
    else await wait(200);
  }
};
main();
