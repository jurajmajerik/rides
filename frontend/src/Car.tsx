import React from 'react';
import CarIcon from './CarIcon';
import { wait } from '../../shared/utils';
import {
  advanceCoord,
  countTurns,
  getNextCoordIndex,
  getRotation,
  getTurnDistance,
} from './movement';
import config from '../../shared/config';

const {
  squareSize,
  fetchInterval,
  refreshInterval,
  turnDuration,
  animationOverhead,
} = config;

interface Props {
  driverId: string;
  path: [number, number][];
  actual: [number, number];
}

interface State {
  position: [number, number];
  rotation: number;
}

export default class Car extends React.Component<Props, State> {
  private latestUpdateAt = 0;
  private rotateBusy = false;
  private moveBusy = false;

  constructor(props: Props) {
    super(props);
    const { path, actual } = props;

    let rotation = 0;
    if (path.length > 1) {
      let pathIndex = path.findIndex(([x, y]) => {
        return x === actual[0] && y === actual[1];
      });
      if (pathIndex === 0) pathIndex = 1;
      rotation = getRotation(path, pathIndex);
    }

    this.state = {
      position: actual,
      rotation,
    };
  }

  async rotate(section: [number, number][], i: number) {
    this.rotateBusy = true;

    let rotation = this.state.rotation;
    const targetRotation = getRotation(section, i);
    if (this.state.rotation === targetRotation)
      return (this.rotateBusy = false);

    const { distClockwise, distCounterclockwise } = getTurnDistance(
      rotation,
      targetRotation
    );
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

  async move(
    actual: [number, number],
    path: [number, number][],
    receivedAt: number
  ) {
    while (this.moveBusy) {
      await wait(100);
      if (receivedAt !== this.latestUpdateAt) return;
    }

    this.moveBusy = true;

    const { position } = this.state;
    let [currX, currY] = position;

    const startIndex = getNextCoordIndex(currX, currY, path);
    const endIndex = path.findIndex(([x, y]) => {
      return x === actual[0] && y === actual[1];
    });

    const section = path.slice(startIndex, endIndex + 1);
    if (section.length < 2) return (this.moveBusy = false);
    const turnCount = countTurns(section);
    const turnsDuration = turnCount * turnDuration;

    const distance = endIndex - startIndex + Math.max(currX % 1, currY % 1);
    const steps =
      (fetchInterval - turnsDuration - animationOverhead) / refreshInterval;
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
        currX = advanceCoord(currX, nextX, increment);

        this.setState({ position: [currX, this.state.position[1]] });
        await wait(refreshInterval);
      }

      while (currY !== nextY) {
        currY = advanceCoord(currY, nextY, increment);

        this.setState({ position: [this.state.position[0], currY] });
        await wait(refreshInterval);
      }
    }

    this.moveBusy = false;
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.actual === this.props.actual) return;

    const receivedAt = Date.now();
    this.latestUpdateAt = receivedAt;
    this.move(this.props.actual, this.props.path, receivedAt);
  }

  render() {
    const { position, rotation } = this.state;

    const [x, y] = position;

    return (
      <CarIcon
        x={parseFloat((x * squareSize - 22).toFixed(2))}
        y={parseFloat((y * squareSize - 22).toFixed(2))}
        rotation={rotation}
      />
    );
  }
}
