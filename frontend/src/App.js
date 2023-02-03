import React from 'react';
import IconCar from './IconCar';
import obstacles from './obstacles';

const gridSize = 500;
const gridCount = 50; // No. of squares in each direction
const squareSize = gridSize / gridCount;

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
      position: props.target,
      rotation: props.rotation,
    };
  }

  async rotate() {
    const wait = (t) => new Promise((res) => {
      setTimeout(() => {
        res();
      }, t);
    });

    while (this.state.rotation < 0) {
      this.setState(state => ({
        position: state.position,
        rotation: state.rotation + 1,
      }));
      await wait(20);
    }
  }

  componentDidMount() {
    // this.rotate();
  }

  render() {
    const { position, rotation } = this.state;
    const [x, y] = position;
    return (
      <>
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
      <IconCar
        x={x * squareSize - 20}
        y={y * squareSize - 20}
        rotation={rotation}
      />
      </>
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

  async updateCars() {
    this.setState(() => ({
      cars: [
        {
          id: 'car1',
          // current: [6,3],
          current: [16,14],
          rotation: 0,
        },
        {
          id: 'car2',
          // current: [6,3],
          current: [26,16],
          rotation: 270,
        }
      ]
    }));
  }

  componentDidMount() {
    this.updateCars();
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

    const cars = this.state.cars.map(({ id, current, path, rotation }) => {
      return <Car key={id} target={current} rotation={rotation} path={path} />;
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

function App() {
  return (
    <div className='App'>
      <SVG />
    </div>
  );
}

export default App;
