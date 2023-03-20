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
      const { driverId, status, pathIndex, location } = driver;
      let path = [];
      if (driver.path) path = JSON.parse(driver.path) as [number, number][];
      const [x, y] = location.split(':');
      cars.push({
        driverId,
        status,
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
  const [paths, setPaths] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const handleSetPaths = ({ driverId, path, animationPathIndex }) => {
    const newPaths = [...paths];
    const newPathItem = { driverId, path, animationPathIndex };
    const indexToUpdate = paths.findIndex((item) => item.driverId === driverId);
    if (indexToUpdate === -1) {
      newPaths.push(newPathItem);
    } else {
      newPaths.splice(indexToUpdate, 1, newPathItem);
    }
    setPaths(newPaths);
  };

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
        key={`o-${x}:${y}`}
        width={squareSize}
        height={squareSize}
        x={x * squareSize}
        y={y * squareSize}
        fill={color}
        stroke={color}
      />
    );
  }

  const carElems = cars.map(({ driverId, actual, path, pathIndex }) => {
    return (
      <Car
        key={`car-${driverId}`}
        driverId={driverId}
        actual={actual}
        pathIndex={pathIndex}
        path={path}
        handleSetPaths={handleSetPaths}
      />
    );
  });

  const Path = ({ path }) => (
    <>
      {path.map((coordPair) => {
        const [x, y] = coordPair;
        return (
          <circle
            key={`p-${x}:${y}`}
            width={squareSize / 4}
            height={squareSize / 4}
            r={squareSize / 6}
            cx={x * squareSize + squareSize / 2}
            cy={y * squareSize + squareSize / 2}
            fill={'gray'}
            stroke={'gray'}
          />
        );
      })}
    </>
  );

  const pathElems = paths.map(({ driverId, animationPathIndex, path }) => (
    <Path key={`p-${driverId}`} path={path.slice(animationPathIndex)} />
  ));

  const seenCustomers = new Set();
  const customerElems = cars
    .filter(({ status }) => status === 'pickup')
    .map(({ path }) => {
      // TEMP FIX FOR NO PATH
      if (!path || path.length === 0) return null;

      const [x, y] = path[path.length - 1];
      seenCustomers.add(`${x}:${y}`);
      return (
        <CustomerIcon
          key={`c1-${x}:${y}`}
          x={x * squareSize - squareSize / 2}
          y={y * squareSize - squareSize / 2}
        />
      );
    });

  customers.forEach(({ location }) => {
    const [x, y] = location.split(':');
    if (seenCustomers.has(`${x}:${y}`)) return;
    customerElems.push(
      <CustomerIcon
        key={`c2-${x}:${y}`}
        x={x * squareSize - squareSize / 2}
        y={y * squareSize - squareSize / 2}
      />
    );
  });

  const destElems = cars
    .filter(({ status }) => status === 'enroute')
    .map(({ path }) => {
      // TEMP FIX FOR NO PATH
      if (!path || path.length === 0) return null;
      const [x, y] = path[path.length - 1];
      return (
        <DestIcon
          key={`d-${x}:${y}`}
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
          {pathElems}
          {carElems}
          {customerElems}
          {destElems}
        </svg>
      </div>
    </div>
  );
};
export default GeoMap;
