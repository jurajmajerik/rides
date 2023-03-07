import { buildGraph, getDestinationRange, generateDestination, } from './methods.js';
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
    let [destX, destY] = generateDestination(0, 0);
    expect(destX).toBeGreaterThanOrEqual(gridCount / 2);
    expect(destX).toBeLessThanOrEqual(gridCount);
    expect(destY).toBeGreaterThanOrEqual(gridCount / 2);
    expect(destY).toBeLessThanOrEqual(gridCount);
    [destX, destY] = generateDestination(50, 50);
    expect(destX).toBeGreaterThanOrEqual(0);
    expect(destX).toBeLessThanOrEqual(25);
    expect(destY).toBeGreaterThanOrEqual(0);
    expect(destY).toBeLessThanOrEqual(25);
});
//# sourceMappingURL=methods.test.js.map