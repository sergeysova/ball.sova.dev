import { MouseEvent } from 'react';
import { createStore, createEvent } from 'effector';

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

export const incrementClicked = createEvent<MouseEvent<HTMLButtonElement>>();
export const resetClicked = createEvent<MouseEvent<HTMLButtonElement>>();