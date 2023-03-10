import { wait } from '../../shared/utils.js';
import { generateDestination } from './methods.js';
const queue = [];
process.on('message', ({ customerId, location }) => {
    queue.push({ customerId, location });
});
const main = async () => {
    while (true) {
        if (queue.length) {
            const { customerId, location } = queue.shift();
            const [x, y] = location;
            let [destX, destY] = generateDestination([x, y]);
            process.send({ customerId, destination: [destX, destY] });
        }
        if (queue.length)
            continue;
        else
            await wait(200);
    }
};
main();
//# sourceMappingURL=getDestination.js.map