import React from 'react';
import Car from './Car';
import obstacles from './obstacles';
import data from './data';
import { getRandomInt, wait } from './utils';

import config from './config';
const {
  gridSize,
  squareSize,
  fetchInterval,
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

    this.previousUpdateAt = Date.now();

    this.state = {
      cars: [],
      actual: null,
    };
  }

  async loadData() {
    while (true) {

      const timeout = 5000;
      const now = Date.now();
      console.log(now - this.previousUpdateAt);

      if ((now - this.previousUpdateAt) > timeout) console.log('TIMEOUT!!!');
      this.previousUpdateAt = now;

      const res = await fetch('http://localhost:8080/rides');
      const rides = await res.json();
  
      const cars = [];
      for (const ride of rides) {
        const { car_id, location } = ride;
        const path = JSON.parse(ride.path);
        const [x, y] = location.split(':');
        cars.push({
          id: car_id,
          path: path,
          next: [parseInt(x), parseInt(y)],
        });
      }

      this.setState({ cars, actual: cars[0].next });
      await wait(fetchInterval);
    }
  }

  componentDidMount() {
    this.loadData();
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
          onClick={() => console.log(`${x}:${y}`)}
        />
      );
    }

    const cars = this.state.cars.map(({ id, next, rotation, path }) => {
      return <Car key={id} next={next} rotation={rotation || 0} path={path} />;
    });

    const { actual } = this.state;

    return (
      <svg
      width={gridSize}
      height={gridSize}
      className="map"
      >
        {obstacleElems}
        { actual
          ?
          <rect
            key={`${actual[0]}:${actual[1]}`}
            width={squareSize}
            height={squareSize}
            x={actual[0] * squareSize}
            y={actual[1] * squareSize}
            fill="red"
          />
          : null }
        {cars}
      </svg>
    );
  }
}
