import React from 'react';
import CarIcon from './CarIcon';
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
    };
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

  async placeCars() {
    this.setState(() => ({
      cars: [
        {
          id: 'car1',
          next: [16,14],
          rotation: 0,
        },
        {
          id: 'car2',
          next: [26,16],
          rotation: 270,
        }
      ]
    }));
  }

  componentDidMount() {
    this.placeCars();
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

    const cars = this.state.cars.map(({ id, next, rotation }) => {
      return <Car key={id} next={next} rotation={rotation} />;
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
