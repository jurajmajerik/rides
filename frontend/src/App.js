import obstacles from './obstacles';

const gridSize = 500;
const gridCount = 50; // No. of squares in each direction

const coordsToObstacles = [];
obstacles.forEach(([xStart, xEnd, yStart, yEnd, color]) => {
  let x = xStart;
  while (x <= xEnd) {
    let y = yStart;
    while (y <= yEnd) {
      coordsToObstacles[`${x}:${y}`] = color || '#d77a61';
      y += 1;
    }
    x += 1;
  }
});

const SVG = () => {
  const squareSize = gridSize / gridCount;
  const Obstacle = ({ type, x, y, color }) => (
    <rect
      width={squareSize}
      height={squareSize}
      x={x}
      y={y}
      fill={color}
      stroke={color}
    />
  );

  const obstacleElems = [];
  for (let [key, color] of Object.entries(coordsToObstacles)) {
    const [x, y] = key.split(':');
    obstacleElems.push(
      <Obstacle
        key={`${x}:${y}`}
        x={x * squareSize}
        y={y * squareSize}
        color={color}
      />
    );
  }

  return (
    <svg
      width={gridSize}
      height={gridSize}
    >
      {obstacleElems}
    </svg>
  )
};

function App() {
  return (
    <div className='App'>
      <SVG />
    </div>
  );
}

export default App;
