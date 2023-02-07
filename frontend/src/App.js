import React from 'react';
import CarIcon from './CarIcon';
import { advanceCoord, countTurns, getNextCoordIndex } from './movement';
import { wait } from './utils';
import obstacles from './obstacles';
import records from './records';

const gridSize = 500;
const gridCount = 50; // No. of squares in each direction
const squareSize = gridSize / gridCount;

const fetchInterval = 1000;
const refreshInterval = 33;
const turnDuration = refreshInterval * 8;

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
    const { path } = props;

    this.state = {
      position: props.next,
      rotation: this.getRotation(path, 1),
      path: props.path,
    };
  }

  getRotation(path, i) {
    let rotation;
    const [x0, y0] = path[i - 1];
    const [x1, y1] = path[i];
    const direction = x1 !== x0 ? 'x' : 'y';

    if (direction === 'x' && x1 > x0) rotation = 90;
    else if (direction === 'x' && x0 > x1) rotation = 270;
    else if (direction === 'y' && y1 > y0) rotation = 180;
    else rotation = 0;

    return rotation;
  };

  async move(next) {
    const { path, position } = this.state;
    let [currX, currY] = position;
  
    const startIndex = getNextCoordIndex(currX, currY, path);
    const endIndex = path.findIndex(([x, y]) => {
      return x === next[0] && y === next[1];
    });
    const section = path.slice(startIndex, endIndex + 1);
    const turnCount = countTurns(section);
    const turnsDuration = turnCount * turnDuration;

    const distance = endIndex - startIndex + Math.max(currX % 1, currY % 1);
    const steps = (fetchInterval - turnsDuration) / refreshInterval;
    const increment = distance / steps;
  
    for (let i = 0; i < section.length; i++) {
      const [nextX, nextY] = section[i];

      // Rotate
      if (i > 0) {
        let currRotation = this.state.rotation;
        const finalRotation = this.getRotation(section, i);
        
        // Counterclockwise
        const distCounterclockwise = (
          finalRotation >= 0 && finalRotation < currRotation
          ? currRotation - finalRotation
          : currRotation + 360 - finalRotation
        );
        const distClockwise = (
          finalRotation > currRotation && finalRotation <= 360
          ? finalRotation - currRotation
          : 360 - currRotation + finalRotation
        );
        const clockwise = distClockwise < distCounterclockwise;

        // Rotate incrementally
        // Get a difference
        const diff = Math.min(distClockwise, distCounterclockwise);
        const steps = turnDuration / refreshInterval;
        const increment = diff / steps;

        // Increment or decrement?

        while (this.state.rotation !== finalRotation) {
          // console.log(currRotation, finalRotation);
          if (clockwise) currRotation += increment;
          else currRotation -= increment;

          if (finalRotation === 0 && currRotation > 360) currRotation = 0;
          if (currRotation < 0) currRotation = 360 - Math.abs(currRotation);
          if (finalRotation !== 0 && clockwise && currRotation > finalRotation) currRotation = finalRotation;

          this.setState(state => ({ // eslint-disable-line
            position: state.position,
            rotation: currRotation,
            path: state.path,
          }));
          await wait(refreshInterval);
        }
      }

      while (currX !== nextX) {
        if (next !== this.props.next) return;

        currX = advanceCoord(currX, nextX, increment);
        this.setState((state) => ({ // eslint-disable-line
          position: [currX, state.position[1]],
          path: state.path,
        }));
        await wait(refreshInterval);
      }

      while (currY !== nextY) {
        if (next !== this.props.next) return;

        currY = advanceCoord(currY, nextY, increment);
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
