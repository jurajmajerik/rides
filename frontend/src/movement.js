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
