import React from 'react';
import obstacles from './obstacles';

const gridSize = 500;
const gridCount = 50; // No. of squares in each direction
const squareSize = gridSize / gridCount;

Number.prototype.round = function(places) { // eslint-disable-line
  return +(Math.round(this + 'e+' + places)  + 'e-' + places);
}

const wait = (t) => new Promise((res) => {
  setTimeout(() => {
    res();
  }, t);
});

const records = [
  {
    id: 'car1',
    current: [0, 20],
    path: [[0, 20],[1,20],[2,20],[3,20],[4,20],[4,19],[4,18],[4,17],[4,16],[4,15],[4,14],[5,14],[6,14],[7,14],[8,14],[8,15],[8,16],[8,17],[9,17],[10,17],[11,17],[12,17],[13,17],[14,17],[15,17],[16,17],[16,18],[16,19],[16,20],[15,20],[14,20],[13,20],[12,20],[11,20],[10,20],[9,20],[8,20]],
  },
  {
    id: 'car1',
    current: [4, 19],
    path: [[0, 20],[1,20],[2,20],[3,20],[4,20],[4,19],[4,18],[4,17],[4,16],[4,15],[4,14],[5,14],[6,14],[7,14],[8,14],[8,15],[8,16],[8,17],[9,17],[10,17],[11,17],[12,17],[13,17],[14,17],[15,17],[16,17],[16,18],[16,19],[16,20],[15,20],[14,20],[13,20],[12,20],[11,20],[10,20],[9,20],[8,20]],
  },
  {
    id: 'car1',
    current: [4, 14],
    path: [[0, 20],[1,20],[2,20],[3,20],[4,20],[4,19],[4,18],[4,17],[4,16],[4,15],[4,14],[5,14],[6,14],[7,14],[8,14],[8,15],[8,16],[8,17],[9,17],[10,17],[11,17],[12,17],[13,17],[14,17],[15,17],[16,17],[16,18],[16,19],[16,20],[15,20],[14,20],[13,20],[12,20],[11,20],[10,20],[9,20],[8,20]],
  },
  {
    id: 'car1',
    current: [11, 17],
    path: [[0, 20],[1,20],[2,20],[3,20],[4,20],[4,19],[4,18],[4,17],[4,16],[4,15],[4,14],[5,14],[6,14],[7,14],[8,14],[8,15],[8,16],[8,17],[9,17],[10,17],[11,17],[12,17],[13,17],[14,17],[15,17],[16,17],[16,18],[16,19],[16,20],[15,20],[14,20],[13,20],[12,20],[11,20],[10,20],[9,20],[8,20]],
  },
  {
    id: 'car1',
    current: [15, 17],
    path: [[0, 20],[1,20],[2,20],[3,20],[4,20],[4,19],[4,18],[4,17],[4,16],[4,15],[4,14],[5,14],[6,14],[7,14],[8,14],[8,15],[8,16],[8,17],[9,17],[10,17],[11,17],[12,17],[13,17],[14,17],[15,17],[16,17],[16,18],[16,19],[16,20],[15,20],[14,20],[13,20],[12,20],[11,20],[10,20],[9,20],[8,20]],
  },
  {
    id: 'car1',
    current: [10, 20],
    path: [[0, 20],[1,20],[2,20],[3,20],[4,20],[4,19],[4,18],[4,17],[4,16],[4,15],[4,14],[5,14],[6,14],[7,14],[8,14],[8,15],[8,16],[8,17],[9,17],[10,17],[11,17],[12,17],[13,17],[14,17],[15,17],[16,17],[16,18],[16,19],[16,20],[15,20],[14,20],[13,20],[12,20],[11,20],[10,20],[9,20],[8,20]],
  },
  {
    id: 'car1',
    current: [8, 20],
    path: [[0, 20],[1,20],[2,20],[3,20],[4,20],[4,19],[4,18],[4,17],[4,16],[4,15],[4,14],[5,14],[6,14],[7,14],[8,14],[8,15],[8,16],[8,17],[9,17],[10,17],[11,17],[12,17],[13,17],[14,17],[15,17],[16,17],[16,18],[16,19],[16,20],[15,20],[14,20],[13,20],[12,20],[11,20],[10,20],[9,20],[8,20]],
  }
];

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

class Car extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currPos: props.target,
      // dest: props.target,
      path: props.path,
    };
  }

  async move(target) {
    // If dest changed, terminate!
    // New instance of move() will be triggered

    // Generate all points between currPos and target
    const { path, currPos } = this.state;
    let [currX, currY] = currPos;

    // Find the "next" point on the path
    const startIndex = path.findIndex(([x, y], index, arr) => {
      if (index === 0) return false;
      return (
        (
          currX <= x && currX >= arr[index - 1][0]
          && y === currY
        ) ||
        (
          currY <= y && currY >= arr[index - 1][1]
          && x === currX
        )
      );
    });

    const endIndex = path.findIndex(([x, y]) => x === target[0] && y === target[1]);

    // Distance to travel
    const distance = endIndex - startIndex + Math.max(currX % 1, currY % 1);

    // How many steps? 100ms / 5ms = 20 steps
    const steps = 100 / 5;
    const increment = distance / steps;

    const section = path.slice(startIndex, endIndex + 1);

    // Traverse every path of the section
    for (let i = 0; i < section.length; i++) {
      const [nextX, nextY] = section[i];

      while (currX !== nextX) {
        // Target must remain the same!
        if (target !== this.props.target) return;

        if (nextX > currX) currX = (currX + increment).round(2);
        else currX = (currX - increment).round(2);

        this.setState((state) => ({ // eslint-disable-line
          currPos: [currX, state.currPos[1]],
          path: state.path,
        }));
        await wait(30);
      }

      while (currY !== nextY) {
        // Target must remain the same!
        if (target !== this.props.target) return;

        if (nextY > currY) currY = (currY + increment).round(2);
        else currY = (currY - increment).round(2);

        this.setState((state) => ({ // eslint-disable-line
          currPos: [state.currPos[0], currY],
          path: state.path,
        }));
        await wait(30);
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.target === this.props.target) return;
    this.move(this.props.target);
  }

  render() {
    const { currPos, path } = this.state;
    const [x, y] = currPos;

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
  }
}

class SVG extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cars: [],
    };
  }

  async updatePosition() {
    for (const record of records) {
      await wait(1000);
      this.setState(state => ({
        cars: [
          {
            id: record.id,
            current: record.current,
            path: record.path,
          }
        ]
      }));
    }
  }

  // async animate() {

  //   let currX = 0;
  //   let currY = 20;

  //   for (let i = 0; i < path.length; i++) {
  //     const [nextX, nextY] = path[i];

  //     const xIncrement = (nextX - currX) / 10;
  //     while (currX !== nextX) {
  //       await wait(5);
  //       this.setState((state) => { // eslint-disable-line
  //         const cars = state.cars.map(({ id, x, y }) => ({ id, x: currX, y }));
  //         return { cars };
  //       });
  //       currX = (currX + xIncrement).round(2);
  //     }


  //     const yIncrement = (nextY - currY) / 10;
  //     while (currY !== nextY) {
  //       await wait(5);
  //       this.setState((state) => { // eslint-disable-line
  //         const cars = state.cars.map(({ id, x, y }) => ({ id, x, y: currY }));
  //         return { cars };
  //       });
  //       currY = (currY + yIncrement).round(2);
  //     }
  //   }
  // }

  componentDidMount() {
    // this.animate();
    this.updatePosition();
  }

  render() {
    const rects = [];
    for (let [key, value] of Object.entries(points)) {
      const { color, type } = value;
      if (type === 'road') continue;
      const [x, y] = key.split(':');
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

    const cars = this.state.cars.map(({ id, current, path }) => {
      return <Car key={id} target={current} path={path} />;
    });

    return (
      <svg
      width={gridSize}
      height={gridSize}
      >
        {rects}
        {cars}
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
