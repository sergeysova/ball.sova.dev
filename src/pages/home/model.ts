/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { MouseEvent } from 'react';
import { createStore, createEvent, combine } from 'effector';

interface Tube {
  balls: BallColor[];
}

export type BallColor =
  | 0x0
  | 0x1
  | 0x2
  | 0x3
  | 0x4
  | 0x5
  | 0x6
  | 0x7
  | 0x8
  | 0x9
  | 0xa
  | 0xb;

export const startClicked = createEvent<MouseEvent<HTMLButtonElement>>();
export const tubeClicked = createEvent<MouseEvent<HTMLDivElement>>();

export const $state = createStore<'start' | 'ingame' | 'won'>('start');
const $tubes = createStore<Tube[]>([]);
const $selectedTube = createStore(-1);

export const $tubesSelected = combine(
  $tubes,
  $selectedTube,
  (tubes, selected) =>
    tubes.map(({ balls }, index) => {
      if (selected === index) {
        return {
          balls: balls.slice(1),
          over: balls[1],
        };
      }
      return {
        balls,
        over: null,
      };
    }),
);

$state.on(startClicked, () => 'ingame');
$tubes.on(startClicked, () => generateNewTubes(12));

function generateNewTubes(filled: number, empty = 2): Tube[] {
  const series = Array.from(
    { length: filled },
    (_, index) => new Array(4).fill(index) as BallColor[],
  );
  const allBalls = shuffle(([] as BallColor[]).concat(...series));

  return Array.from({ length: filled }, () =>
    Array.from({ length: 4 }, () => allBalls.pop()!),
  )
    .concat([[], []])
    .map((balls) => ({ balls }));
}

function shuffle<T>(array: Array<T>): Array<T> {
  return array.sort(() => Math.random() - 0.5);
}
