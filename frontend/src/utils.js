Number.prototype.round = function(places) { // eslint-disable-line
  return +(Math.round(`${this}e+${places}e-${places}`));
}

export const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const wait = (t) => new Promise((res) => {
  setTimeout(() => {
    res();
  }, t);
});
