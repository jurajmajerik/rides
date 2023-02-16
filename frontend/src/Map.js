import React from 'react';
import Car from './Car';
import obstacles from './obstacles';
import data from './data';
import { getRandomInt, wait } from './utils';

import config from './config';
const {
  gridSize,
  squareSize,
} = config;

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

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cars: [],
    };
  }

  async simulate() {
    const updateCount = data[0].updates.length;
    for (let i = 0; i < updateCount; i++) {      
      const cars = [];
      for (let j = 0; j < data.length; j++) {
        const update = {
          id: data[j].id,
          path: data[j].path,
          next: data[j].updates[i],
        };
        cars.push(update);
      }
      this.setState({ cars });
      const interval = getRandomInt(1000, 2000);
      console.log(interval);
      await wait(interval);
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