import { wait } from '../../shared/utils.js';
import { getShortestPath } from './methods.js';
const queue = [];
process.on('message', ({ driverId, startingPosition, destination }) => {
    queue.push({ driverId, startingPosition, destination });
});
const main = async () => {
    while (true) {
        if (queue.length) {
            const { driverId, startingPosition, destination } = queue.shift();
            let path = getShortestPath(startingPosition, destination);
            process.send({ driverId, path });
        }
        if (queue.length)
            continue;
        else
            await wait(200);
    }
};
main();
//# sourceMappingURL=routePlanner.js.map