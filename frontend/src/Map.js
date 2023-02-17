import React from 'react';
import Car from './Car';
import obstacles from './obstacles';
import { api, wait } from './utils';

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
      refreshing: false,
    };
  }

  async loadData() {
    while (true) {
      const rides = await api.get('/rides');

      const timeout = 2000;
      const now = Date.now();
      if ((now - this.previousUpdateAt) > timeout) {
        this.previousUpdateAt = now;
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
          actual: [parseInt(x), parseInt(y)],
        });
      }

      this.setState({ cars, refreshing: false });
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

    const cars = this.state.cars.map(({ id, actual, rotation, path }) => {
      return <Car key={id} actual={actual} rotation={rotation || 0} path={path} />;
    });

    const actuals = this.state.cars.map(({ id, actual }) => {
      return (
        <rect
          key={`${actual[0]}:${actual[1]}`}
          width={squareSize}
          height={squareSize}
          x={actual[0] * squareSize}
          y={actual[1] * squareSize}
          fill="red"
        />
      );
    });

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
            {actuals}
            {cars}
          </svg>
        </div>
      </div>
    );
  }
}
