import md5 from 'md5';
import { wait } from '../../shared/utils.js';

const queue = [];

process.on('message', ({ name, input }) => {
  queue.push({ name, input });
});

const main = async () => {
  while (true) {
    if (queue.length) {
      const { name, input } = queue.shift();
      await wait(800);
      const destination = md5(input);
      process.send({ name, destination });
    }

    if (queue.length) continue;
    else await wait(200);
  }
};
main();
