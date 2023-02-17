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

const api = {};
const baseUrl = (
  process.env.REACT_APP_ENV === 'dev'
  ? 'http://localhost:8080'
  : 'https://app.jurajmajerik.com'
);
api.get = async endpoint => {
  const res = await fetch(`${baseUrl}${endpoint}`);
  if (res.json) return await res.json();
  return res;
};

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
      refreshing: false,
    };
  }

  async loadData() {
    while (true) {
      const rides = await api.get('/rides');

      const timeout = 2000;
      const now = Date.now();
      if ((now - this.previousUpdateAt) > timeout) {
        // console.log(`TIMEOUT ${now - this.previousUpdateAt}`);
        this.previousUpdateAt = now;
        // Here set the state to "refreshing:true"
        // Then above check:
        // If no timeout, cancel refreshing:true to remove the refresh UI
        this.setState({ cars: [], refreshing: true });
        await wait(fetchInterval);
        continue;
      }

      this.previousUpdateAt = now;
  
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

      this.setState({ cars, actual: cars[0].next, refreshing: false });
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
      <div className="map">
        <div className="map-inner">
          <div className={`map-refresh ${this.state.refreshing ? 'active' : ''}`} />
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
        </div>
      </div>
    );
  }
}
