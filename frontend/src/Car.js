import React from 'react';
import CarIcon from './CarIcon';
import { wait } from './utils';
import {
  advanceCoord,
  countTurns,
  getNextCoordIndex,
  getRotation,
  getTurnDistance
} from './movement';

import config from './config';
const {
  squareSize,
  fetchInterval,
  refreshInterval,
  turnDuration,
} = config;

export default class Car extends React.Component {
  constructor(props) {
    super(props);
    const { path } = props;

    this.timestamp = 0;
    this.rotateBusy = false;
    this.moveBusy = false;
    this.state = {
      position: props.next,
      rotation: getRotation(path, 1),
      path: props.path,
    };
  }

  async rotate(section, i) {
    this.rotateBusy = true;

    let rotation = this.state.rotation;
    const targetRotation = getRotation(section, i);
    if (this.state.rotation === targetRotation) return this.rotateBusy = false;

    const { distClockwise, distCounterclockwise } = getTurnDistance(rotation, targetRotation);
    const isClockwise = distClockwise < distCounterclockwise;

    const diff = Math.min(distClockwise, distCounterclockwise);
    const steps = turnDuration / refreshInterval;
    const increment = diff / steps;

    while (this.state.rotation !== targetRotation) {
      if (isClockwise) rotation += increment;
      else rotation -= increment;

      if (rotation > 360) rotation = 0;
      else if (rotation < 0) rotation = 360 - Math.abs(rotation);

      this.setState({ rotation });
      await wait(refreshInterval);
    }

    this.rotateBusy = false;
  }

  async move(next, path, timestamp) {
    while (this.moveBusy) {
      await wait(100);
      if (timestamp !== this.timestamp) return;
    }
    if (timestamp !== this.timestamp) return;

    
    this.moveBusy = true;
    
    const { position } = this.state;
    let [currX, currY] = position;

    console.log(currX, currY);
    console.log(next, path);
  
    const startIndex = getNextCoordIndex(currX, currY, path);

    if (startIndex === -1) {
      this.setState({ position: [path[0][0], path[0][1]], path });
      return this.moveBusy = false;
    }

    const endIndex = path.findIndex(([x, y]) => {
      return x === next[0] && y === next[1];
    });

    if (startIndex === -1 || endIndex === -1) return this.moveBusy = false;
    const section = path.slice(startIndex, endIndex + 1);
    if (section.length < 2) return this.moveBusy = false;
    const turnCount = countTurns(section);
    const turnsDuration = turnCount * turnDuration;

    const distance = endIndex - startIndex + Math.max(currX % 1, currY % 1);
    const overhead = 300;
    const steps = (fetchInterval - turnsDuration - overhead) / refreshInterval;
    const increment = distance / steps;
  
    for (let i = 0; i < section.length; i++) {
      if (i > 0) {
        while (this.rotateBusy) {
          await wait(refreshInterval);
        }
        await this.rotate(section, i);
      }

      const [nextX, nextY] = section[i];
      while (currX !== nextX) {
        // if (next !== this.props.next) return;

        currX = advanceCoord(currX, nextX, increment);
        this.setState({ position: [currX, this.state.position[1]], path });
        await wait(refreshInterval);
      }

      while (currY !== nextY) {
        // if (next !== this.props.next) return;

        currY = advanceCoord(currY, nextY, increment);
        this.setState({ position: [this.state.position[0], currY], path });
        await wait(refreshInterval);
      }
    }

    this.moveBusy = false;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.next === this.props.next) return;
    const timestamp = new Date().getTime();
    this.timestamp = timestamp;
    this.move(this.props.next, this.props.path, timestamp);
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