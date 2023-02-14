const wait = (t) => new Promise((res) => {
  setTimeout(() => {
    res();
  }, t);
});

const main = async () => {
  while(true) {
    console.log(`Hello ${Math.floor(Math.random() * 100)}`);
    await wait(200);
  }
};
main();
