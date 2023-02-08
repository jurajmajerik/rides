export const isBetween = (val, curr, prev) => (
  (val <= curr && val >= prev)
  ||
  (val >= curr && val <= prev)
);

export const getNextCoordIndex = (currX, currY, path) => {
  return path.findIndex(([x, y], i, path) => {
    if (currX === path[i][0] && currY === path[i][1]) return true;
    if (i === 0) return false;

    const xMatches = x === currX;
    const yMatches = y === currY;

    return (
      (xMatches && isBetween(currY, path[i][1], path[i - 1][1]))
      ||
      (yMatches && isBetween(currX, path[i][0], path[i - 1][0]))
    );
  });
}

export const advanceCoord = (curr, next, increment) => {
  if (next > curr) {
    curr = curr + increment;
    if (curr + increment > next) curr = next;
  } else {
    curr = curr - increment;
    if (curr - increment < next) curr = next;
  }

  return curr;
};

export const getDirection = (section, i) => {
  const x0 = section[i - 1][0];
  const x1 = section[i][0];
  return x1 !== x0 ? 'x' : 'y';
};

export const countTurns = (section) => {
  let count = 0;
  let currDirection = getDirection(section, 1);

  for (let i = 2; i < section.length; i++) {
    let newDirection = getDirection(section, i);
    if (newDirection !== currDirection) {
      currDirection = newDirection;
      count++;
    }
  }

  return count;
};

export const getRotation = (path, i) => {
  const [x0, y0] = path[i - 1];
  const [x1, y1] = path[i];
  const direction = x1 !== x0 ? 'x' : 'y';

  if (direction === 'x' && x1 > x0) return 90;
  else if (direction === 'x' && x0 > x1) return 270;
  else if (direction === 'y' && y1 > y0) return 180;
  else return 0;
};

export const getTurnDistance = (curr, target) => ({
  distClockwise: (
    target > curr && target <= 360
    ? target - curr
    : 360 - curr + target
  ),
  distCounterclockwise: (
    target >= 0 && target < curr
    ? curr - target
    : curr + 360 - target
  ),
});
