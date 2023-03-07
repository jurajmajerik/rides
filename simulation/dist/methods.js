import obstacles from '../../shared/obstacles.js';
import { getRandomInt } from '../../shared/utils.js';
import config from '../../shared/config.js';
const { gridCount } = config;
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
                roadNodes.push(`${x}:${y}`);
            }
        }
    }
    return roadNodes;
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
    const obstaclesSet = getObstaclesSet(obstacles);
    return buildGraph(obstaclesSet, gridCount);
};
export const getDestinationRange = (coord) => coord < gridCount / 2
    ? [gridCount / 2 + Math.floor(coord / 2), gridCount]
    : [0, gridCount / 2 - Math.floor((gridCount - coord) / 2)];
export const generateDestination = (startX, startY) => {
    const rangeX = getDestinationRange(startX);
    const rangeY = getDestinationRange(startY);
    return [
        getRandomInt(rangeX[0], rangeX[1]),
        getRandomInt(rangeY[0], rangeY[1]),
    ];
};
//# sourceMappingURL=methods.js.map