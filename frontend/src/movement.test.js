import {
  advanceCoord,
  countTurns,
  getDirection,
  getNextCoordIndex,
  getRotation,
  getTurnDistance,
  isBetween,
} from './movement';

test('check if a number is between two numbers inclusive', () => {
  expect(isBetween(14.23, 15, 14)).toEqual(true);
  expect(isBetween(15.32, 16, 15)).toEqual(true);
  expect(isBetween(16, 16, 15)).toEqual(true);
  expect(isBetween(15, 16, 15)).toEqual(true);
  expect(isBetween(14, 16, 15)).toEqual(false);
});

test('get the index next set of coords on the path', () => {
  let path = [
    [0, 20],
    [1, 20],
    [2, 20],
    [3, 20],
    [4, 20],
  ];
  expect(getNextCoordIndex(1.23, 20, path)).toEqual(2);
  expect(getNextCoordIndex(2, 20, path)).toEqual(2);
  expect(getNextCoordIndex(0, 20, path)).toEqual(0);
  expect(getNextCoordIndex(4, 20, path)).toEqual(4);

  path = [
    [8, 17],
    [8, 16],
    [8, 15],
    [8, 14],
    [7, 14],
    [6, 14],
    [6, 13],
    [6, 12],
    [6, 11],
    [6, 10],
    [6, 9],
    [6, 8],
    [6, 7],
    [6, 6],
    [7, 6],
    [8, 6],
    [9, 6],
    [10, 6],
    [11, 6],
    [12, 6],
    [12, 7],
    [12, 8],
    [12, 9],
    [12, 10],
    [12, 11],
    [12, 12],
    [12, 13],
    [12, 14],
    [13, 14],
    [14, 14],
    [15, 14],
    [16, 14],
    [16, 13],
  ];
  expect(getNextCoordIndex(8, 16, path)).toEqual(1);
});

test('advance a coordinate', () => {
  expect(advanceCoord(1.48, 2, 0.22)).toEqual(1.7);
  expect(advanceCoord(1.99, 2, 0.22)).toEqual(2.0);
});

test('count turns', () => {
  let section = [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 0],
    [5, 0],
  ];
  expect(countTurns(section)).toEqual(0);

  section = [
    [0, 0],
    [1, 0],
    [1, 1],
  ];
  expect(countTurns(section)).toEqual(1);

  section = [
    [0, 0],
    [1, 0],
    [1, 1],
    [2, 1],
    [2, 2],
  ];
  expect(countTurns(section)).toEqual(3);

  section = [
    [0, 0],
    [1, 0],
    [1, 1],
    [2, 1],
    [2, 2],
    [3, 2],
    [4, 2],
    [5, 2],
    [6, 2],
    [6, 3],
  ];
  expect(countTurns(section)).toEqual(5);
});

test('get direction', () => {
  expect(
    getDirection(
      [
        [0, 0],
        [1, 0],
      ],
      1
    )
  ).toEqual('x');
  expect(
    getDirection(
      [
        [0, 1],
        [0, 2],
      ],
      1
    )
  ).toEqual('y');
});

test('get rotation', () => {
  expect(
    getRotation(
      [
        [0, 1],
        [0, 0],
      ],
      1
    )
  ).toEqual(0);
  expect(
    getRotation(
      [
        [0, 0],
        [1, 0],
      ],
      1
    )
  ).toEqual(90);
  expect(
    getRotation(
      [
        [0, 0],
        [0, 1],
      ],
      1
    )
  ).toEqual(180);
  expect(
    getRotation(
      [
        [1, 0],
        [0, 0],
      ],
      1
    )
  ).toEqual(270);
});

test('get turn distance', () => {
  expect(getTurnDistance(90, 0)).toEqual({
    distClockwise: 270,
    distCounterclockwise: 90,
  });
  expect(getTurnDistance(90, 180)).toEqual({
    distClockwise: 90,
    distCounterclockwise: 270,
  });
  expect(getTurnDistance(90, 180)).toEqual({
    distClockwise: 90,
    distCounterclockwise: 270,
  });
  expect(getTurnDistance(180, 0)).toEqual({
    distClockwise: 180,
    distCounterclockwise: 180,
  });
  expect(getTurnDistance(180, 360)).toEqual({
    distClockwise: 180,
    distCounterclockwise: 180,
  });
  expect(getTurnDistance(0, 90)).toEqual({
    distClockwise: 90,
    distCounterclockwise: 270,
  });
  expect(getTurnDistance(360, 90)).toEqual({
    distClockwise: 90,
    distCounterclockwise: 270,
  });
  expect(getTurnDistance(270, 90)).toEqual({
    distClockwise: 180,
    distCounterclockwise: 180,
  });
  expect(getTurnDistance(270, 0)).toEqual({
    distClockwise: 90,
    distCounterclockwise: 270,
  });
  expect(getTurnDistance(270, 360)).toEqual({
    distClockwise: 90,
    distCounterclockwise: 270,
  });
});
