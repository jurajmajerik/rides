import obstacles from '../_config/obstacles.js';

export const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min) + min);

export const decide = probability => getRandomInt(1, 100) < probability;

export const wait = (t) => new Promise((res) => {
  setTimeout(() => {
    res();
  }, t);
});

const gridSize = 500;
const gridCount = 50; // No. of squares in each direction
const squareSize = gridSize / gridCount;
const fetchInterval = 1500;
const refreshInterval = 16;
const turnDuration = refreshInterval * 8;
const animationOverhead = 200;

const points = {};
for (let x = 0; x < gridCount; x += 1) {
  for (let y = 0; y < gridCount; y += 1) {
    points[`${x}:${y}`] = true;
  } 
}

const setObstacle = (xStart, xEnd, yStart, yEnd) => {
  let x = xStart;
  while (x <= xEnd) {
    let y = yStart;
    while (y <= yEnd) {
      points[`${x}:${y}`] = false;
      y += 1;
    }
    x += 1;
  }
};
obstacles.forEach(args => {
  setObstacle(...args);
});
console.log(points);

const getCoordsToObstacles = () => {
  const coordsToObstacles = {};
  obstacles.forEach(([xStart, xEnd, yStart, yEnd]) => {
    let x = xStart;
    while (x <= xEnd) {
      let y = yStart;
      while (y <= yEnd) {
        coordsToObstacles[`${x}:${y}`] = true;
        y += 1;
      }
      x += 1;
    }
  });

  return coordsToObstacles;
};

export const getRoadNodes = () => {
  const coordsToObstacles = getCoordsToObstacles();

  const roadNodes = [];
  for (let x = 0; x < 100; x++) {
    for (let y = 0; y < 100; y++) {
      if (!coordsToObstacles[`${x}:${y}`]) {
        roadNodes.push(`${x}:${y}`);
      }
    }
  }

  return roadNodes;
};

export const getGraph = () => {
  const graph = { '0:0': {} };
  const visited = {};

  const build = async ({ x, y }) => {
    visited[`${x}:${y}`] = true;
    const currentNode = graph[`${x}:${y}`];

    const neighbours = [
      [x, y - 1],
      [x + 1, y],
      [x, y + 1],
      [x - 1, y],
    ];
  
    for (const [x, y] of neighbours) {
      const coords = `${x}:${y}`;
      if (points[coords]) {
        graph[coords] = graph[coords] || {};
        currentNode[coords] = graph[coords];
        if (!visited[coords]) build({ x, y });
      }
    }
  };


  build({ x: 0, y: 0 });

  return graph;
};
