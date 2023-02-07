Number.prototype.round = function(places) { // eslint-disable-line
  return +(Math.round(`${this}e+${places}e-${places}`));
}

export const wait = (t) => new Promise((res) => {
  setTimeout(() => {
    res();
  }, t);
});
