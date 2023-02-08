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

    this.state = {
      position: props.next,
      rotation: getRotation(path, 1),
      path: props.path,
    };
  }

  async rotate(section, i) {
    let rotation = this.state.rotation;
    const targetRotation = getRotation(section, i);
    if (this.state.rotation === targetRotation) return;

    const { distClockwise, distCounterclockwise } = getTurnDistance(rotation, targetRotation);
    const isClockwise = distClockwise < distCounterclockwise;

    const diff = Math.min(distClockwise, distCounterclockwise);
    const steps = turnDuration / refreshInterval;
    const increment = diff / steps;

    while (this.state.rotation !== targetRotation) {
      if (isClockwise) rotation += increment;
      else rotation -= increment;

      if (targetRotation === 0 && rotation > 360) rotation = 0;
      else if (rotation < 0) rotation = 360 - Math.abs(rotation);
      else if (targetRotation !== 0 && isClockwise && rotation > targetRotation) rotation = targetRotation;

      this.setState(state => ({ // eslint-disable-line
        position: state.position,
        rotation,
        path: state.path,
      }));
      await wait(refreshInterval);
    }
  }

  async move(next) {
    if (next !== this.props.next) return;
    const { path, position } = this.state;
    let [currX, currY] = position;
  
    const startIndex = getNextCoordIndex(currX, currY, path);
    const endIndex = path.findIndex(([x, y]) => {
      return x === next[0] && y === next[1];
    });
    const section = path.slice(startIndex, endIndex + 1);
    const turnCount = countTurns(section);
    const turnsDuration = turnCount * turnDuration;

    const distance = endIndex - startIndex + Math.max(currX % 1, currY % 1);
    const steps = (fetchInterval - turnsDuration) / refreshInterval;
    const increment = distance / steps;
  
    for (let i = 0; i < section.length; i++) {
      if (i > 0) await this.rotate(section, i);

      const [nextX, nextY] = section[i];
      while (currX !== nextX) {
        if (next !== this.props.next) return;

        currX = advanceCoord(currX, nextX, increment);
        this.setState((state) => ({ // eslint-disable-line
          position: [currX, state.position[1]],
          path: state.path,
        }));
        await wait(refreshInterval);
      }

      while (currY !== nextY) {
        if (next !== this.props.next) return;

        currY = advanceCoord(currY, nextY, increment);
        this.setState((state) => ({ // eslint-disable-line
          position: [state.position[0], currY],
          path: state.path,
        }));
        await wait(refreshInterval);
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.next === this.props.next) return;
    this.move(this.props.next);
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
