export const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min) + min);

export const decide = probability => getRandomInt(1, 100) < probability;

export const wait = (t) => new Promise((res) => {
  setTimeout(() => {
    res();
  }, t);
});
