import React from 'react';
import Car from './Car';
import obstacles from '../../shared/obstacles';
import { api } from './api';
import { wait } from '../../shared/utils';
import config from '../../shared/config';
import CustomerIcon from './CustomerIcon';
const {
  gridSize,
  squareSize,
  fetchInterval,
} = config;

const obstaclesMap = (() => {
  const obstaclesMap = new Map();
  obstacles.forEach(([xStart, xEnd, yStart, yEnd, color]) => {
    let x = xStart;
    while (x <= xEnd) {
      let y = yStart;
      while (y <= yEnd) {
        obstaclesMap.set(`${x}:${y}`, color || '#c1c3c7');
        y += 1;
      }
      x += 1;
    }
  });
  return obstaclesMap;
})();

export default class GeoMap extends React.Component {
  constructor(props) {
    super(props);

    this.previousUpdateAt = Date.now();
    this.state = {
      cars: [],
      customers: [],
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

  async loadCustomers() {
    while (true) {
      const customers = await api.get('/customers');
      this.setState({ customers });
      await wait(fetchInterval);
    }
  }

  componentDidMount() {
    this.loadData();
    this.loadCustomers();
  }

  render() {
    const obstacleElems = [];
    for (let [key, color] of obstaclesMap) {
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
          // onClick={() => console.log(`${x}:${y}`)}
        />
      );
    }

    const cars = this.state.cars.map(({ id, actual, rotation, path }) => {
      return <Car key={id} actual={actual} rotation={rotation || 0} path={path} />;
    });

    const customers = this.state.customers.map(({ id, name, location }) => {
      const [x, y] = location.split(':');
      return (
        <CustomerIcon
          key={`${x}:${y}`}
          x={x * squareSize - (squareSize / 2)}
          y={y * squareSize - (squareSize / 2)}
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
          viewBox='0 0 1000 1000'
          >
            {obstacleElems}
            {cars}
            {customers}
          </svg>
        </div>
      </div>
    );
  }
}
