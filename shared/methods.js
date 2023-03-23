import obstacles from './obstacles.js';

export const getObstaclesMap = () => {
  const obstaclesMap = new Map();
  obstacles.forEach(([xStart, xEnd, yStart, yEnd, color]) => {
    let x = xStart;
    while (x <= xEnd) {
      let y = yStart;
      while (y <= yEnd) {
        obstaclesMap.set(`${x}:${y}`, color || '#c1c3c7');
        y += 1;
      }
      x += 1;
    }
  });
  return obstaclesMap;
};