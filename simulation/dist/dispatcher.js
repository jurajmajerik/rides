import { wait } from '../../shared/utils.js';
const customerQueue = [];
const drivers = [];
process.on('message', ({ from, data }) => {
    if (from === 'customer') {
        const { customerId, location } = data;
        customerQueue.push({ customerId, location });
    }
    else if (from === 'driver') {
        const { driverId, location } = data;
        drivers.push({ driverId, location });
    }
    console.log(customerQueue, drivers);
});
const main = async () => {
    while (true) {
        if (customerQueue.length) {
            const { customerId, location } = customerQueue[0];
            const [x, y] = location;
        }
        if (customerQueue.length)
            continue;
        else
            await wait(1000);
    }
};
main();
//# sourceMappingURL=dispatcher.js.map