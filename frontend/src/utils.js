import config from './config';

export const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min) + min);

export const decide = probability => getRandomInt(1, 100) < probability;

export const wait = (t) => new Promise((res) => {
  setTimeout(() => {
    res();
  }, t);
});

export const drawHelper = (() => {
  const { gridCount } = config;
  const points = {};
  for (let x = 0; x < gridCount; x += 1) {
    for (let y = 0; y < gridCount; y += 1) {
      points[`${x}:${y}`] = true;
    } 
  }

  let count = 0;
  let minX = null, maxX = null, minY = null, maxY = null;

  const allCoords = [];

  const highlightObstacle = () => {
    let x = minX;
    while (x <= maxX) {
      let y = minY;
      while (y <= maxY) {
        const rect = points[`${x}:${y}`];
        rect.setAttribute('fill', 'gray');
        y += 1;
      }
      x += 1;
    }
  };

  return (x, y) => {
    count += 1;

    if (!minX || x < minX) minX = x;
    if (!maxX || x > maxX) maxX = x;
    if (!minY || y < minY) minY = y;
    if (!maxY || y > maxY) maxY = y;

    highlightObstacle();

    if (count === 3) {
      count = 0;
      allCoords.push([minX, maxX, minY, maxY]);
      minX = null;
      maxX = null;
      minY = null;
      maxY = null;
      console.log(JSON.stringify(allCoords));
    }
  };
})();
