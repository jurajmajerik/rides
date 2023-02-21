const { spawn } = require('child_process');

const wait = (t) => new Promise((res) => {
  setTimeout(() => {
    res();
  }, t);
});

const main = async () => {
  const child = spawn('node', ['heavyComputation.js']);
  child.on('message', msg => {
    console.log('JAAAAAAAAAAA');
    console.log('Received hash:', msg);
  });

  child.on('exit', (code, signal) => {
    console.log(`Child process exited with code ${code} and signal ${signal}`);
  });

  while (true) {
    console.log(`Run ${Date.now()}`);
    await wait(300);
  }
};
main();
