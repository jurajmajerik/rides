import React from 'react';
import CarIcon from './CarIcon';
import obstacles from './obstacles';

const gridSize = 500;
const gridCount = 50; // No. of squares in each direction
const squareSize = gridSize / gridCount;

const fetchInterval = 2000;
const refreshInterval = 30; // every 30ms

const records = [
  {
    id: 'car1',
    next: [0, 20],
    path: [[0, 20],[1,20],[2,20],[3,20],[4,20],[4,19],[4,18],[4,17],[4,16],[4,15],[4,14],[5,14],[6,14],[7,14],[8,14],[8,15],[8,16],[8,17],[9,17],[10,17],[11,17],[12,17],[13,17],[14,17],[15,17],[16,17],[16,18],[16,19],[16,20],[15,20],[14,20],[13,20],[12,20],[11,20],[10,20],[9,20],[8,20]],
  },
  {
    id: 'car1',
    next: [4, 19],
    path: [[0, 20],[1,20],[2,20],[3,20],[4,20],[4,19],[4,18],[4,17],[4,16],[4,15],[4,14],[5,14],[6,14],[7,14],[8,14],[8,15],[8,16],[8,17],[9,17],[10,17],[11,17],[12,17],[13,17],[14,17],[15,17],[16,17],[16,18],[16,19],[16,20],[15,20],[14,20],[13,20],[12,20],[11,20],[10,20],[9,20],[8,20]],
  },
  {
    id: 'car1',
    next: [4, 14],
    path: [[0, 20],[1,20],[2,20],[3,20],[4,20],[4,19],[4,18],[4,17],[4,16],[4,15],[4,14],[5,14],[6,14],[7,14],[8,14],[8,15],[8,16],[8,17],[9,17],[10,17],[11,17],[12,17],[13,17],[14,17],[15,17],[16,17],[16,18],[16,19],[16,20],[15,20],[14,20],[13,20],[12,20],[11,20],[10,20],[9,20],[8,20]],
  },
  {
    id: 'car1',
    next: [11, 17],
    path: [[0, 20],[1,20],[2,20],[3,20],[4,20],[4,19],[4,18],[4,17],[4,16],[4,15],[4,14],[5,14],[6,14],[7,14],[8,14],[8,15],[8,16],[8,17],[9,17],[10,17],[11,17],[12,17],[13,17],[14,17],[15,17],[16,17],[16,18],[16,19],[16,20],[15,20],[14,20],[13,20],[12,20],[11,20],[10,20],[9,20],[8,20]],
  },
  {
    id: 'car1',
    next: [15, 17],
    path: [[0, 20],[1,20],[2,20],[3,20],[4,20],[4,19],[4,18],[4,17],[4,16],[4,15],[4,14],[5,14],[6,14],[7,14],[8,14],[8,15],[8,16],[8,17],[9,17],[10,17],[11,17],[12,17],[13,17],[14,17],[15,17],[16,17],[16,18],[16,19],[16,20],[15,20],[14,20],[13,20],[12,20],[11,20],[10,20],[9,20],[8,20]],
  },
  {
    id: 'car1',
    next: [10, 20],
    path: [[0, 20],[1,20],[2,20],[3,20],[4,20],[4,19],[4,18],[4,17],[4,16],[4,15],[4,14],[5,14],[6,14],[7,14],[8,14],[8,15],[8,16],[8,17],[9,17],[10,17],[11,17],[12,17],[13,17],[14,17],[15,17],[16,17],[16,18],[16,19],[16,20],[15,20],[14,20],[13,20],[12,20],[11,20],[10,20],[9,20],[8,20]],
  },
  {
    id: 'car1',
    next: [8, 20],
    path: [[0, 20],[1,20],[2,20],[3,20],[4,20],[4,19],[4,18],[4,17],[4,16],[4,15],[4,14],[5,14],[6,14],[7,14],[8,14],[8,15],[8,16],[8,17],[9,17],[10,17],[11,17],[12,17],[13,17],[14,17],[15,17],[16,17],[16,18],[16,19],[16,20],[15,20],[14,20],[13,20],[12,20],[11,20],[10,20],[9,20],[8,20]],
  }
];

Number.prototype.round = function(places) { // eslint-disable-line
  return +(Math.round(this + 'e+' + places)  + 'e-' + places);
}

const wait = (t) => new Promise((res) => {
  setTimeout(() => {
    res();
  }, t);
});

const coordsToObstacles = [];
obstacles.forEach(([xStart, xEnd, yStart, yEnd, color]) => {
  let x = xStart;
  while (x <= xEnd) {
    let y = yStart;
    while (y <= yEnd) {
      coordsToObstacles[`${x}:${y}`] = color || '#c1c3c7';
      y += 1;
    }
    x += 1;
  }
});

const Obstacle = ({ x, y, color }) => (
  <rect
    width={squareSize}
    height={squareSize}
    x={x}
    y={y}
    fill={color}
    stroke={color}
  />
);

class Car extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      position: props.next,
      rotation: props.rotation,
      path: props.path,
    };
  }

  async rotate() {
    const wait = (t) => new Promise((res) => {
      setTimeout(() => {
        res();
      }, t);
    });
    while (true) {
      this.setState(state => ({ position: state.position, rotation: state.rotation + 1 }));
      await wait(20);
    }
  }

  async move(next) {
    // If dest changed, terminate!
    // New instance of move() will be triggered
  
    // Generate all points between position and target
    const { path, position } = this.state;
    let [currX, currY] = position;
  
    // Find the nearest point on the path
    const startIndex = path.findIndex(([x, y], i, arr) => {
      if (i === 0) return false;

      const xMatches = x === currX;
      const yMatches = y === currY;

      const isBetween = (currVal, arr, i, coord) => {
        const coordIndex = coord === 'x' ? 0 : 1;
        const currItem = arr[i][coordIndex];
        const prevItem = arr[i - 1][coordIndex];
        return (
          (currVal <= currItem && currVal >= prevItem)
          ||
          (currVal >= currItem && currVal <= prevItem)
        );
      };

      return (
        (xMatches
          && isBetween(currY, arr, i, 'y')
        )
        ||
        (yMatches
          && isBetween(currX, arr, i, 'x')
        )
      );
    });

    const endIndex = path.findIndex(([x, y]) => {
      return x === next[0] && y === next[1];
    });

    // Create section & count turns
    const section = [];
    let turnCount = 0;
    let direction = path[startIndex][0] === path[startIndex + 1][0] ? 'x' : 'y';
    for (let i = startIndex; i <= endIndex; i++) {
      if (path[i + 1]) {
        if (direction === 'x' && path[i + 1][1] !== path[i][1]) {
          direction = 'y';
          turnCount++;
        } else if (direction === 'y' && path[i + 1][0] !== path[i][0]) {
          direction = 'x;'
          turnCount++;
        }
      }
      section.push(path[i]);
    }

    // How many squares to traverse
    const distance = endIndex - startIndex + Math.max(currX % 1, currY % 1);

    // Turn duration
    const turnsDuration = turnCount * 200;

    // How many steps? 2000ms / 30ms = 20 steps
    const steps = (fetchInterval) / refreshInterval;

    const increment = distance / steps;

    
  
    // Traverse every path of the section
    for (let i = 0; i < section.length; i++) {

      const [nextX, nextY] = section[i];

      while (currX !== nextX) {
        if (next !== this.props.next) return;

        if (nextX > currX) {
          currX = currX + increment;
          if (currX + increment > nextX) currX = nextX;
        } else {
          currX = currX - increment;
          if (currX - increment < nextX) currX = nextX;
        }

        this.setState((state) => ({ // eslint-disable-line
          position: [currX, state.position[1]],
          path: state.path,
        }));
        await wait(refreshInterval);
      }

      while (currY !== nextY) {
        if (next !== this.props.next) return;

        if (nextY > currY) {
          currY = currY + increment;
          if (currY + increment > nextY) currY = nextY;
        } else {
          currY = currY - increment;
          if (currY - increment < nextY) currY = nextY;
        }
  
        this.setState((state) => ({ // eslint-disable-line
          position: [state.position[0], currY],
          path: state.path,
        }));
        await wait(refreshInterval);
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.next === this.props.next) return;
    this.move(this.props.next);
  }

  render() {
    const { position, rotation } = this.state;

    const [x, y] = position;
    return (
      <CarIcon
        x={x * squareSize - 20}
        y={y * squareSize - 20}
        rotation={rotation}
      />
    );
  }
}

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cars: [],
    };
  }

  async simulate() {
    for (const record of records) {
      this.setState(state => ({
        cars: [record]
      }));
      await wait(fetchInterval);
    }
  }

  componentDidMount() {
    this.simulate();
  }

  render() {
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

    const cars = this.state.cars.map(({ id, next, rotation, path }) => {
      return <Car key={id} next={next} rotation={rotation || 0} path={path} />;
    });

    return (
      <svg
      width={gridSize}
      height={gridSize}
      className="map"
      >
        {obstacleElems}
        {cars}
      </svg>
    );
  }
}

function App() {
  return (
    <div className='App'>
      <Map />
    </div>
  );
}

export default App;
