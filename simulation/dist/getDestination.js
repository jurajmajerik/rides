import { wait } from '../../shared/utils.js';
import { generateDestination } from './methods.js';
const queue = [];
process.on('message', ({ name, location }) => {
    queue.push({ name, location });
});
const main = async () => {
    while (true) {
        if (queue.length) {
            const { name, location } = queue.shift();
            const x = location[0];
            const y = location[1];
            const destination = generateDestination(x, y);
            process.send({ name, destination });
        }
        if (queue.length)
            continue;
        else
            await wait(200);
    }
};
main();
//# sourceMappingURL=getDestination.js.map