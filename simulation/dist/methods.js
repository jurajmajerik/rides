import obstacles from '../../shared/obstacles.js';
import { getRandomInt } from '../../shared/utils.js';
import config from '../../shared/config.js';
const { gridCount } = config;
const cache = { graph: null };
export const getObstaclesSet = (obstacles) => {
    const obstaclesSet = new Set();
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
export const getRoadNodes = () => {
    const obstaclesSet = getObstaclesSet(obstacles);
    const roadNodes = [];
    for (let x = 0; x < gridCount; x++) {
        for (let y = 0; y < gridCount; y++) {
            if (!obstaclesSet.has(`${x}:${y}`)) {
                roadNodes.push([x, y]);
            }
        }
    }
    return roadNodes.filter(([x, y]) => {
        return x !== 0 && x !== gridCount - 1 && y !== 0 && y !== gridCount - 1;
    });
};
export const buildGraph = (obstaclesSet, gridCount) => {
    const graph = [];
    for (let y = 0; y < gridCount; y++) {
        graph[y] = [];
        for (let x = 0; x < gridCount; x++) {
            if (obstaclesSet.has(`${x}:${y}`))
                graph[y][x] = 0;
            else
                graph[y][x] = 1;
        }
    }
    return graph;
};
export const getGraph = () => {
    if (cache.graph)
        return cache.graph;
    cache.graph = buildGraph(getObstaclesSet(obstacles), gridCount);
    return cache.graph;
};
export const getDestinationRange = (coord) => coord < gridCount / 2
    ? [gridCount / 2 + Math.floor(coord / 2), gridCount]
    : [0, gridCount / 2 - Math.floor((gridCount - coord) / 2)];
export const getClosestRoadNode = (x, y, graph = getGraph()) => {
    const isValid = (y, x) => y > 0 && y < graph.length - 1 && x > 0 && x < graph[y].length - 1;
    if (isValid(y, x) && graph[y][x] === 1)
        return [x, y];
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
export const generateDestination = (coordPair) => {
    const [startX, startY] = coordPair;
    const rangeX = getDestinationRange(startX);
    const rangeY = getDestinationRange(startY);
    const destX = getRandomInt(rangeX[0], rangeX[1]);
    const destY = getRandomInt(rangeY[0], rangeY[1]);
    let destination = getClosestRoadNode(destX, destY);
    return destination;
};
export const getStraightLineDistance = (coordsA, coordsB) => {
    const [xA, yA] = coordsA;
    const [xB, yB] = coordsB;
    return Math.sqrt(Math.pow(xB - xA, 2) + Math.pow(yB - yA, 2));
};
export const getShortestPath = (startingPosition, destination, graph = getGraph()) => {
    const isValid = (y, x) => y > 0 &&
        y < graph.length - 1 &&
        x > 0 &&
        x < graph[y].length - 1 &&
        graph[y][x] === 1;
    const directions = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
    ];
    const [col, row] = startingPosition;
    let queue = [[row, col, [startingPosition]]];
    const seen = new Set([`${row}:${col}`]);
    while (queue.length) {
        const nextQueue = [];
        for (let i = 0; i < queue.length; i++) {
            const [row, col, currPath] = queue[i];
            if (row === destination[1] && col === destination[0]) {
                return currPath;
            }
            for (let j = 0; j < directions.length; j++) {
                const [dx, dy] = directions[j];
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
//# sourceMappingURL=methods.js.map