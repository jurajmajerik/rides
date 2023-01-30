import obstacles from './obstacles';

const gridSize = 500;
const gridCount = 50; // No. of squares in each direction

// Populate points
const points = [];
for (let x = 0; x < gridCount; x += 1) {
  for (let y = 0; y < gridCount; y += 1) {
    points[`${x}:${y}`] = { type: 'road' };
  } 
}
obstacles.forEach(([xStart, xEnd, yStart, yEnd, color]) => {
  let x = xStart;
  while (x <= xEnd) {
    let y = yStart;
    while (y <= yEnd) {
      points[`${x}:${y}`] = { type: 'obstacle', color };
      y += 1;
    }
    x += 1;
  }
});

// Build graph
const graph = { '0:0': {} };
const visited = {};
const build = async ({ x, y }) => {
  visited[`${x}:${y}`] = true;
  const currentNode = graph[`${x}:${y}`];

  const neighbours = [
    [x, y - 1],
    [x + 1, y],
    [x, y + 1],
    [x - 1, y],
  ];

  for (const [x, y] of neighbours) {
    const coords = `${x}:${y}`;
    if (points[coords]) {
      graph[coords] = graph[coords] || {};
      currentNode[coords] = graph[coords];
      if (!visited[coords]) await build({ x, y });
    }
  }
};
build({ x: 0, y: 0 });

const SVG = () => {
  const squareSize = gridSize / gridCount;
  const Rect = ({ type, x, y, color }) => (
    <rect
      width={squareSize}
      height={squareSize}
      x={x}
      y={y}
      fill={ type === 'road' ? 'white' : (color || '#d77a61') }
      stroke={ type === 'road' ? 'white' : (color || '#d77a61') }
    />
  );

  const rects = [];
  for (let [key, value] of Object.entries(points)) {
    const [x, y] = key.split(':');
    const { color, type } = value;
    rects.push(
      <Rect
        key={`${x}:${y}`}
        type={type}
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
      {rects}
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
