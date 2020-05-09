import { MouseEvent } from 'react';
import { createStore, createEvent, sample, combine } from 'effector';
import { debug } from 'patronum/debug';
import { gameStarted, ballMoved, $tubes, Tube } from './model';

type HistorySlice = Tube[];

export const undoClicked = createEvent<MouseEvent<HTMLButtonElement>>();
export const redoClicked = createEvent<MouseEvent<HTMLButtonElement>>();
const historyWrote = createEvent<HistorySlice>();
const historyRestored = createEvent<HistorySlice>();

const $history = createStore<HistorySlice[]>([]);
const $currentPosition = createStore(-1);
export const $undoCount = $currentPosition.map((pos) => (pos < 0 ? 0 : pos));

debug($history, $currentPosition);

sample({ source: $tubes, clock: gameStarted, target: historyWrote });
sample({ source: $tubes, clock: ballMoved, target: historyWrote });

$currentPosition
  .on(historyWrote, (position) => position + 1)
  .on(undoClicked, (position) => (position <= 1 ? 0 : position - 1));

sample({
  source: [$history, $currentPosition],
  clock: historyWrote,
  fn: ([history, position], slice) =>
    history.slice(0, position).concat([slice]),
  target: $history,
});

sample({
  source: [$history, $currentPosition],
  clock: undoClicked,
  fn: ([history, position]) => history[position],
  target: historyRestored,
});

$tubes.on(historyRestored, (_, slice) => slice);
