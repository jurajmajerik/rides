import React from 'react';
import obstacles from './obstacles';

const gridSize = 500;
const gridCount = 50; // No. of squares in each direction
const squareSize = gridSize / gridCount;

Number.prototype.round = function(places) {
  return +(Math.round(this + "e+" + places)  + "e-" + places);
}

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

const Car = ({ x, y }) => {
  return (
    <rect
      className='car'
      fill="black"
      stroke='black'
      key={`${x}:${y}`}
      width={squareSize}
      height={squareSize}
      x={x * squareSize}
      y={y * squareSize}
      style={{
      }}
    />
  );
};

class SVG extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cars: [
        { id: 'car1', x: 0, y: 20 },
      ]
    };
  }

  async animate() {
    const wait = (t) => new Promise((res) => {
      setTimeout(() => {
        res();
      }, t);
    });

    const path = [
      // [0,20],
      [1,20],
      [2,20],
      [3,20],
      [4,20],
      [4,19],
      [4,18],
      [4,17],
      [4,16],
      [4,15],
      [4,14],
      [5,14],
      [6,14],
      [7,14],
      [8,14],
      [8,15],
      [8,16],
      [8,17],
      [9,17],
      [10,17],
      [11,17],
      [12,17],
      [13,17],
      [14,17],
      [15,17],
      [16,17],
      [16,18],
      [16,19],
      [16,20],
      [15,20],
      [14,20],
      [13,20],
      [12,20],
      [11,20],
      [10,20],
      [9,20],
      [8,20],
    ];

    let currX = 0;
    let currY = 20;

    const move = ({ coord, dir }) => {
      if (coord === 'x') {
        if (dir === 'right') {
        }
      }
    };

    for (let i = 0; i < path.length; i++) {
      const [nextX, nextY] = path[i];

      const xIncrement = (nextX - currX) / 10;
      while (currX !== nextX) {
        await wait(5);
        this.setState((state) => { // eslint-disable-line
          const cars = state.cars.map(({ id, x, y }) => ({ id, x: currX, y }));
          return { cars };
        });
        currX = (currX + xIncrement).round(2);
      }


      const yIncrement = (nextY - currY) / 10;
      while (currY !== nextY) {
        await wait(5);
        this.setState((state) => { // eslint-disable-line
          const cars = state.cars.map(({ id, x, y }) => ({ id, x, y: currY }));
          return { cars };
        });
        currY = (currY + yIncrement).round(2);
      }
    }
  }

  componentDidMount() {
    this.animate();
  }

  render() {
    const rects = [];
    for (let [key, value] of Object.entries(points)) {
      const [x, y] = key.split(':');
      const { color, type } = value;
      rects.push(
        <Point
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
        {
          this.state.cars.map(({ id, x, y }) => (
            <Car key={id} x={x} y={y} />
          ))
        }
      </svg>
    );
  }
}

const Point = ({ type, x, y, color }) => (
  <rect
  width={squareSize}
  height={squareSize}
  x={x}
  y={y}
  fill={ type === 'road' ? 'white' : (color || '#c1c3c7') }
  stroke={ type === 'road' ? 'white' : (color || '#c1c3c7') }
  />
);

function App() {
  return (
    <div className='App'>
      <SVG />
    </div>
  );
}

export default App;
