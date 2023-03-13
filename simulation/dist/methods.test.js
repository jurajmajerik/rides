import { buildGraph, getDestinationRange, generateDestination, getClosestRoadNode, getShortestPath,
// @ts-ignore
 } from './methods';
import config from '../../shared/config.js';
const { gridCount } = config;
test('return a graph represented as n x n matrix', () => {
    let gridCount = 3;
    let obstaclesSet = new Set(['0:0', '1:1', '2:2']);
    let expected = [
        [0, 1, 1],
        [1, 0, 1],
        [1, 1, 0],
    ];
    expect(buildGraph(obstaclesSet, gridCount)).toEqual(expected);
    gridCount = 6;
    obstaclesSet = new Set(['0:2', '0:3', '1:2', '1:3', '5:5', '4:5']);
    expected = [
        [1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1],
        [0, 0, 1, 1, 1, 1],
        [0, 0, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 0, 0],
    ];
    expect(buildGraph(obstaclesSet, gridCount)).toEqual(expected);
});
test('return a range of possible destinations for a starting coordinate', () => {
    expect(getDestinationRange(0)).toEqual([50, 100]);
    expect(getDestinationRange(49)).toEqual([74, 100]);
    expect(getDestinationRange(50)).toEqual([0, 25]);
    expect(getDestinationRange(99)).toEqual([0, 50]);
});
test('return destination coordinates', () => {
    let [destX, destY] = generateDestination([0, 0]);
    expect(destX).toBeGreaterThanOrEqual(gridCount / 2);
    expect(destX).toBeLessThanOrEqual(gridCount);
    expect(destY).toBeGreaterThanOrEqual(gridCount / 2);
    expect(destY).toBeLessThanOrEqual(gridCount);
    [destX, destY] = generateDestination([50, 50]);
    expect(destX).toBeGreaterThanOrEqual(0);
    expect(destX).toBeLessThanOrEqual(25);
    expect(destY).toBeGreaterThanOrEqual(0);
    expect(destY).toBeLessThanOrEqual(25);
});
test('return the closest road node (can be the node itself)', () => {
    const graph = [
        [0, 1, 1, 1, 0],
        [1, 0, 1, 1, 0],
        [1, 0, 0, 1, 0],
        [1, 0, 1, 1, 0],
        [1, 1, 0, 0, 0],
    ];
    expect(getClosestRoadNode(2, 2, graph)).toEqual([2, 1]);
    expect(getClosestRoadNode(1, 3, graph)).toEqual([2, 3]);
});
test('return the shortest path between two points', () => {
    const graph = [
        [1, 0, 0, 0, 0, 1],
        [1, 1, 1, 0, 1, 1],
        [0, 0, 1, 0, 1, 0],
        [0, 0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0],
    ];
    const startingPosition = [1, 1];
    const destination = [4, 1];
    const path = getShortestPath(startingPosition, destination, graph);
    expect(path).toEqual([
        [1, 1],
        [2, 1],
        [2, 2],
        [2, 3],
        [3, 3],
        [4, 3],
        [4, 2],
        [4, 1],
    ]);
});
//# sourceMappingURL=methods.test.js.map