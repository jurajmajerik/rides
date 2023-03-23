import obstacles from '../../shared/obstacles.js';
import { getRandomInt } from '../../shared/utils.js';
import config from '../../shared/config.js';
import { getObstaclesMap } from '../../shared/methods.js';
import { Coord, CoordPair, Graph, Path } from './types.js';

const { gridCount } = config;

interface Cache {
  graph: Graph | null;
}
const cache: Cache = { graph: null };

export const getRoadNodes = (): CoordPair[] => {
  const obstaclesMap = getObstaclesMap(obstacles);

  const roadNodes: CoordPair[] = [];
  for (let x = 0; x < gridCount; x++) {
    for (let y = 0; y < gridCount; y++) {
      if (!obstaclesMap.get(`${x}:${y}`)) {
        roadNodes.push([x, y]);
      }
    }
  }

  return roadNodes.filter(([x, y]: CoordPair) => {
    return x !== 0 && x !== gridCount - 1 && y !== 0 && y !== gridCount - 1;
  });
};

export const buildGraph = (
  obstaclesMap: Map<string, string>,
  gridCount: number
): Graph => {
  const graph: Graph = [];
  for (let y = 0; y < gridCount; y++) {
    graph[y] = [];

    for (let x = 0; x < gridCount; x++) {
      if (obstaclesMap.get(`${x}:${y}`)) graph[y][x] = 0;
      else graph[y][x] = 1;
    }
  }

  return graph;
};

export const getGraph = (): Graph => {
  if (cache.graph) return cache.graph;
  cache.graph = buildGraph(getObstaclesMap(obstacles), gridCount);
  return cache.graph;
};

export const getDestinationRange = (coord: number): [number, number] =>
  coord < gridCount / 2
    ? [gridCount / 2 + Math.floor(coord / 2), gridCount]
    : [0, gridCount / 2 - Math.floor((gridCount - coord) / 2)];

export const getClosestRoadNode = (
  x: number,
  y: number,
  graph: Graph = getGraph()
): CoordPair => {
  const isValid = (y, x) =>
    y >= 0 && y < graph.length && x >= 0 && x < graph[y].length;

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
          if (graph[nextY][nextX] === 1) {
            return [nextX, nextY];
          }
          seen.add(`${nextY}:${nextX}`);
          nextQueue.push([nextY, nextX]);
        }
      }
    }
    queue = nextQueue;
  }
};

export const generateDestination = (coordPair: CoordPair): CoordPair => {
  const [startX, startY] = coordPair;
  const rangeX = getDestinationRange(startX);
  const rangeY = getDestinationRange(startY);

  const destX = getRandomInt(rangeX[0], rangeX[1]);
  const destY = getRandomInt(rangeY[0], rangeY[1]);

  let destination = getClosestRoadNode(destX, destY);

  return destination;
};

export const getStraightLineDistance = (
  coordsA: CoordPair,
  coordsB: CoordPair
): number => {
  const [xA, yA] = coordsA;
  const [xB, yB] = coordsB;
  return Math.sqrt(Math.pow(xB - xA, 2) + Math.pow(yB - yA, 2));
};

export const getShortestPath = (
  startingPosition: CoordPair,
  destination: CoordPair,
  graph: Graph = getGraph()
): Path => {
  const isValid = (y, x) =>
    y >= 0 &&
    y < graph.length &&
    x >= 0 &&
    x < graph[y].length &&
    graph[y][x] === 1;

  const directions: [number, number][] = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  const [col, row]: CoordPair = startingPosition;
  let queue: [Coord, Coord, CoordPair[]][] = [[row, col, [startingPosition]]];
  const seen = new Set([`${row}:${col}`]);

  while (queue.length) {
    const nextQueue = [];
    for (let i = 0; i < queue.length; i++) {
      const [row, col, currPath] = queue[i];

      if (row === destination[1] && col === destination[0]) {
        return currPath;
      }

      for (let j = 0; j < directions.length; j++) {
        const [dx, dy]: [number, number] = directions[j];

        const nextRow = row + dy;
        const nextCol = col + dx;

        if (isValid(nextRow, nextCol) && !seen.has(`${nextRow}:${nextCol}`)) {
          seen.add(`${nextRow}:${nextCol}`);
          nextQueue.push([nextRow, nextCol, [...currPath, [nextCol, nextRow]]]);
        }
      }
    }
    queue = nextQueue;
  }
};
