import obstacles from '../../shared/obstacles.js';
import { getRandomInt } from '../../shared/utils.js';
import config from '../../shared/config.js';
import { CoordPair, Graph, Obstacles } from './types.js';

const { gridCount } = config;

interface Cache {
  graph: Graph | null;
}
const cache: Cache = { graph: null };

export const getObstaclesSet = (obstacles: Obstacles): Set<string> => {
  const obstaclesSet = new Set<string>();
  obstacles.forEach(([xStart, xEnd, yStart, yEnd]) => {
    let x = xStart;
    while (x <= xEnd) {
      let y = yStart;
      while (y <= yEnd) {
        obstaclesSet.add(`${x}:${y}`);
        y += 1;
      }
      x += 1;
    }
  });

  return obstaclesSet;
};

export const getRoadNodes = (): CoordPair[] => {
  const obstaclesSet = getObstaclesSet(obstacles);

  const roadNodes: CoordPair[] = [];
  for (let x = 0; x < gridCount; x++) {
    for (let y = 0; y < gridCount; y++) {
      if (!obstaclesSet.has(`${x}:${y}`)) {
        roadNodes.push([x, y]);
      }
    }
  }

  return roadNodes;
};

export const buildGraph = (
  obstaclesSet: Set<string>,
  gridCount: number
): Graph => {
  const graph: Graph = [];
  for (let y = 0; y < gridCount; y++) {
    graph[y] = [];

    for (let x = 0; x < gridCount; x++) {
      if (obstaclesSet.has(`${x}:${y}`)) graph[y][x] = 0;
      else graph[y][x] = 1;
    }
  }

  return graph;
};

export const getGraph = (): Graph => {
  if (cache.graph) return cache.graph;
  cache.graph = buildGraph(getObstaclesSet(obstacles), gridCount);
  return cache.graph;
};

export const getDestinationRange = (coord: number): [number, number] =>
  coord < gridCount / 2
    ? [gridCount / 2 + Math.floor(coord / 2), gridCount]
    : [0, gridCount / 2 - Math.floor((gridCount - coord) / 2)];

export const getClosestRoadNode = (
  x: number,
  y: number,
  graph: Graph
): CoordPair => {
  const isValid = (y, x) =>
    y > 0 && y < graph.length - 1 && x > 0 && x < graph[y].length - 1;

  if (isValid(y, x) && graph[y][x] === 1) return [x, y];

  const directions = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
  ];

  let queue = [[y, x]];
  const seen = new Set([`${y}:${x}`]);

  while (queue.length) {
    const nextQueue = [];

    for (let i = 0; i < queue.length; i++) {
      const [y, x] = queue[i];

      for (const [dx, dy] of directions) {
        const nextY = y + dy;
        const nextX = x + dx;

        if (isValid(nextY, nextX) && !seen.has(`${nextY}:${nextX}`)) {
          if (graph[nextY][nextX] === 1) return [nextX, nextY];
          seen.add(`${nextY}:${nextX}`);
          nextQueue.push([nextY, nextX]);
        }
      }
    }
    queue = nextQueue;
  }
};

export const generateDestination = (coordPair: CoordPair): CoordPair => {
  const graph = getGraph();

  const [startX, startY] = coordPair;
  const rangeX = getDestinationRange(startX);
  const rangeY = getDestinationRange(startY);

  const destX = getRandomInt(rangeX[0], rangeX[1]);
  const destY = getRandomInt(rangeY[0], rangeY[1]);

  let destination = getClosestRoadNode(destX, destY, graph);

  return destination;
};
