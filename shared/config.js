const gridSize = 1000;
const gridCount = 100;
const squareSize = gridSize / gridCount;
const fetchInterval = 1500;
const refreshInterval = 16;
const turnDuration = refreshInterval * 8;
const animationOverhead = 200;
const maxActiveCustomers = 15;

const config = {
  maxActiveCustomers,
  gridSize,
  gridCount,
  fetchInterval,
  refreshInterval,
  
  squareSize,
  turnDuration,
  animationOverhead,
};

export default config;
