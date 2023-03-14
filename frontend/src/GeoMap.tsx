import { useState, useEffect, useRef } from 'react';
import Car from './Car';
import obstacles from '../../shared/obstacles';
import { api } from './api';
import { wait } from '../../shared/utils';
import config from '../../shared/config';
import CustomerIcon from './CustomerIcon';
import DestIcon from './DestIcon';

const { gridSize, squareSize, fetchInterval } = config;

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

const loadData = async (previousUpdateAtRef, setCars, setRefreshing) => {
  while (true) {
    const drivers = await api.get('/drivers');

    const timeout = 2000;
    const now = Date.now();
    if (now - previousUpdateAtRef.current > timeout) {
      previousUpdateAtRef.current = now;
      setCars([]);
      setRefreshing(true);
      await wait(fetchInterval);
      continue;
    }
    previousUpdateAtRef.current = now;

    const cars = [];
    for (const driver of drivers) {
      const { driverId, pathIndex, location } = driver;
      const path = JSON.parse(driver.path) as [number, number][];
      const [x, y] = location.split(':');
      cars.push({
        id: driverId,
        actual: [parseInt(x), parseInt(y)],
        path,
        pathIndex,
      });
    }

    setCars(cars);
    setRefreshing(false);
    await wait(fetchInterval);
  }
};

const loadCustomers = async (setCustomers) => {
  while (true) {
    const customers = await api.get('/customers');
    setCustomers(customers);
    await wait(fetchInterval);
  }
};

const GeoMap = () => {
  const previousUpdateAtRef = useRef(Date.now());

  const [cars, setCars] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    previousUpdateAtRef.current = Date.now();

    loadData(previousUpdateAtRef, setCars, setRefreshing);
    loadCustomers(setCustomers);
  }, []);

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

  const carElems = cars.map(({ id, actual, path }) => {
    return <Car key={id} actual={actual} path={path} />;
  });

  const mapElems = cars.map(({ path, pathIndex }) => {
    return path.slice(pathIndex).map((coordPair) => {
      const [x, y] = coordPair;
      return (
        <circle
          key={`${x}:${y}`}
          width={squareSize / 4}
          height={squareSize / 4}
          r={squareSize / 6}
          cx={x * squareSize + squareSize / 2}
          cy={y * squareSize + squareSize / 2}
          fill={'gray'}
          stroke={'gray'}
          // onClick={() => console.log(`${x}:${y}`)}
        />
      );
    });
  });

  const customerElems = customers.map(({ location }) => {
    const [x, y] = location.split(':');
    return (
      <CustomerIcon
        key={`${x}:${y}`}
        x={x * squareSize - squareSize / 2}
        y={y * squareSize - squareSize / 2}
      />
    );
  });

  const destElems = customers.map(({ destination }) => {
    const [x, y] = destination.split(':');
    return (
      <DestIcon
        key={`${x}:${y}`}
        x={x * squareSize - squareSize / +5}
        y={y * squareSize - squareSize / 2 - 8}
      />
    );
  });

  return (
    <div className="map">
      <div className="map-inner">
        <div className={`map-refresh ${refreshing ? 'active' : ''}`} />
        <svg
          width={gridSize}
          height={gridSize}
          viewBox={`0 0 ${gridSize} ${gridSize}`}
        >
          {obstacleElems}
          {mapElems}
          {carElems}
          {customerElems}
          {destElems}
        </svg>
      </div>
    </div>
  );
};
export default GeoMap;
