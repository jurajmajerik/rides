import React from 'react';
import CarIcon from './CarIcon';
import { advanceCoord, getNextCoordIndex } from './movement';
import { wait } from './utils';
import obstacles from './obstacles';
import records from './records';

const gridSize = 500;
const gridCount = 50; // No. of squares in each direction
const squareSize = gridSize / gridCount;

const fetchInterval = 1000;
const refreshInterval = 33;

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

class Car extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      position: props.next,
      rotation: props.rotation,
      path: props.path,
    };
  }

  async move(next) {
    const { path, position } = this.state;
    let [currX, currY] = position;
  
    const startIndex = getNextCoordIndex(currX, currY, path);
    const endIndex = path.findIndex(([x, y]) => {
      return x === next[0] && y === next[1];
    });
    const section = path.slice(startIndex, endIndex + 1);

    const distance = endIndex - startIndex + Math.max(currX % 1, currY % 1);
    const steps = fetchInterval / refreshInterval;
    const increment = distance / steps;
  
    for (let i = 0; i < section.length; i++) {

      const [nextX, nextY] = section[i];

      while (currX !== nextX) {
        if (next !== this.props.next) return;

        currX = advanceCoord(currX, nextX, increment);
        this.setState({ position: [currX, this.state.position[1]] });
        await wait(refreshInterval);
      }

      while (currY !== nextY) {
        if (next !== this.props.next) return;

        currY = advanceCoord(currY, nextY, increment);
        this.setState({ position: [this.state.position[0], currY] });
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
      this.setState({ cars: [record] });
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
        <rect
          key={`${x}:${y}`}
          width={squareSize}
          height={squareSize}
          x={x * squareSize}
          y={y * squareSize}
          fill={color}
          stroke={color}
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
