const md5 = require('md5');

const wait = (t) => new Promise((res) => {
  setTimeout(() => {
    res();
  }, t);
});

const main = async (txt) => {
  console.log('here');
  await wait(2000);
  const msg = md5(txt);
  process.send(msg);
};
export default main;
