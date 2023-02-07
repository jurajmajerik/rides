import { advanceCoord, countTurns, getNextCoordIndex, isBetween } from './movement';

test('check if a number is between two numbers inclusive', () => {
  expect(isBetween(14.23, 15, 14)).toEqual(true);
  expect(isBetween(15.32, 16, 15)).toEqual(true);
  expect(isBetween(16, 16, 15)).toEqual(true);
  expect(isBetween(15, 16, 15)).toEqual(true);
  expect(isBetween(14, 16, 15)).toEqual(false);
});

test('get the index next set of coords on the path', () => {
  const path = [[0, 20],[1,20],[2,20],[3,20],[4,20]];
  expect(getNextCoordIndex(1.23, 20, path)).toEqual(2);
  expect(getNextCoordIndex(2, 20, path)).toEqual(2);
  expect(getNextCoordIndex(0, 20, path)).toEqual(0);
  expect(getNextCoordIndex(4, 20, path)).toEqual(4);
});

test('advance a coordinate', () => {
  expect(advanceCoord(1.48, 2, 0.22)).toEqual(1.70);
  expect(advanceCoord(1.99, 2, 0.22)).toEqual(2.00);
});

test('count turns', () => {
  let section = [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0]];
  expect(countTurns(section)).toEqual(0);

  section = [[0,0],[1,0],[1,1]];
  expect(countTurns(section)).toEqual(1);

  section = [[0,0],[1,0],[1,1],[2,1],[2,2]];
  expect(countTurns(section)).toEqual(3);

  section = [[0,0],[1,0],[1,1],[2,1],[2,2],[3,2],[4,2],[5,2],[6,2],[6,3]];
  expect(countTurns(section)).toEqual(5);
});
