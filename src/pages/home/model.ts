/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { MouseEvent } from 'react';
import { createStore, createEvent, combine, guard, sample } from 'effector';

interface Tube {
  balls: BallColor[];
}

const BALLS_IN_TUBE = 4;
export const LEVELS = {
  easy: 5,
  medium: 8,
  hard: 12,
};

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
export const difficultyClicked = createEvent<keyof typeof LEVELS>();
export const tubeClicked = createEvent<MouseEvent<HTMLDivElement>>();
const tubeSelected = tubeClicked
  .filterMap((event) => event.currentTarget.dataset.position)
  .map((position) => Number.parseInt(position, 10));

export const $difficulty = createStore<keyof typeof LEVELS>('easy');
export const $state = createStore<'start' | 'ingame' | 'won'>('start');
const $tubes = createStore<Tube[]>([]);
const NO_SELECTED = -1;
const $selectedTubeIndex = createStore(NO_SELECTED);

export const $tubesWithSelected = combine(
  $tubes,
  $selectedTubeIndex,
  (tubes, selected) =>
    tubes.map(({ balls }, index) => {
      if (selected === index) {
        return {
          balls: balls.slice(1),
          complete: false,
          over: balls[0],
        };
      }
      return {
        balls,
        complete: isFull({ balls }) && balls.every(eachSame),
        over: null,
      };
    }),
);

const $selectedTube = combine(
  $tubes,
  $selectedTubeIndex,
  (tubes, selected) =>
    tubes.filter((_, index) => selected === index)[0] ?? null,
);

const $selectedBall = $selectedTube.map(
  (tube) => (tube ? tube.balls[0] : null) ?? null,
);

const won = guard({
  source: $tubes,
  filter: checkWinner,
});

const gameStarted = sample({
  source: $difficulty,
  clock: startClicked,
  fn: (diff) => LEVELS[diff],
});

const tubeSelectedWithTubes = sample({
  source: [$tubes, $selectedTubeIndex, $selectedBall],
  clock: tubeSelected,
  fn: ([tubes, selectedIndex, selectedBall], clickedIndex) => ({
    tubes,
    // Already selected ball is over the tube
    selectedIndex,
    selectedBall,

    // Just clicked
    clickedIndex,
    clickedTube: tubes[clickedIndex],
  }),
});

const ballMoved = guard({
  source: tubeSelectedWithTubes,
  filter({ selectedIndex, clickedIndex, selectedBall, clickedTube }) {
    if (selectedBall === null) return false;
    if (selectedIndex === clickedIndex) return false;
    if (isFull(clickedTube)) return false;

    if (isEmpty(clickedTube)) {
      return true;
    }
    if (isSameColor(clickedTube, selectedBall)) {
      return true;
    }
    return false;
  },
});

const ballIsTaken = guard({
  source: tubeSelectedWithTubes,
  filter({ selectedBall, clickedTube, clickedIndex, tubes }) {
    if (selectedBall !== null) return false;
    if (isEmpty(clickedTube)) return false;
    return true;
  },
});

const ballPutBack = guard({
  source: tubeSelectedWithTubes,
  filter: ({ selectedIndex, clickedIndex }) => selectedIndex === clickedIndex,
});

$difficulty.on(difficultyClicked, (_, set) => set);

$state.on(gameStarted, () => 'ingame').on(won, () => 'won');
$tubes.on(gameStarted, (_, count) => generateNewTubes(count));

$selectedTubeIndex
  .on(ballIsTaken, (_, { clickedIndex }) => clickedIndex)
  .on(ballPutBack, () => NO_SELECTED)
  .on(ballMoved, () => NO_SELECTED);

$tubes.on(
  ballMoved,
  (_, { tubes, clickedIndex, selectedIndex, selectedBall }) =>
    tubes.map((tube, index) => {
      if (index === selectedIndex) {
        return { balls: tube.balls.slice(1) };
      }
      if (index === clickedIndex) {
        return { balls: [selectedBall!, ...tube.balls] };
      }
      return tube;
    }),
);

function generateNewTubes(filled: number, empty = 2): Tube[] {
  const series = Array.from(
    { length: filled },
    (_, index) => new Array(BALLS_IN_TUBE).fill(index) as BallColor[],
  );
  const allBalls = shuffle(([] as BallColor[]).concat(...series));

  return Array.from({ length: filled }, () =>
    Array.from({ length: BALLS_IN_TUBE }, () => allBalls.pop()!),
  )
    .concat(Array.from({ length: empty }, () => []))
    .map((balls) => ({ balls }));
}

function shuffle<T>(array: Array<T>): Array<T> {
  return array.sort(() => Math.random() - 0.5);
}

function isEmpty(tube: Tube): boolean {
  return tube.balls.length === 0;
}

function isFull(tube: Tube): boolean {
  return tube.balls.length === BALLS_IN_TUBE;
}

function isSameColor(tube: Tube, ball: BallColor): boolean {
  return tube.balls[0] === ball;
}

function eachSame(value: BallColor, index: number, list: BallColor[]): boolean {
  return value === list[0];
}

function checkWinner(tubes: Tube[]): boolean {
  for (const tube of tubes) {
    if (!isEmpty(tube) && !isFull(tube)) {
      return false;
    }

    if (!tube.balls.every(eachSame)) {
      return false;
    }
  }

  return true;
}
