/* eslint-disable react/no-array-index-key */
import * as React from 'react';
import { useStore, useList } from 'effector-react';
import styled, { StyledComponent } from 'styled-components';
import {
  $state,
  $tubesWithSelected,
  $difficulty,
  BallColor,
  startClicked,
  tubeClicked,
  difficultyClicked,
} from './model';

const $isWon = $state.map((state) => state === 'won');

export const HomePage: React.FC = () => {
  const state = useStore($state);

  if (state === 'start') {
    return <StartScreen />;
  }

  return <InPlay />;
};

const StartScreen: React.FC = () => {
  const difficulty = useStore($difficulty);

  return (
    <Content>
      <Title>
        LA<span>BALL</span>ATORY
      </Title>
      <fieldset>
        <legend>Difficulty</legend>
        <Button
          selected={difficulty === 'easy'}
          onClick={() => difficultyClicked('easy')}
          text="Easy"
        />
        <Button
          selected={difficulty === 'medium'}
          onClick={() => difficultyClicked('medium')}
          text="Medium"
        />
        <Button
          selected={difficulty === 'hard'}
          onClick={() => difficultyClicked('hard')}
          text="Hard"
        />
      </fieldset>
      <br />
      <Button onClick={startClicked} text="Start game" />
    </Content>
  );
};

const Content = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  align-content: center;
  justify-content: center;
`;

const Title = styled.h2`
  font-size: 3rem;
  font-weight: 300;

  & span {
    text-decoration: underline;
  }
`;

interface Button {
  selected?: boolean;
  text: React.ReactNode;
}

const buttonMap = ({ selected, text }: Button) => ({
  'data-selected': selected ?? false,
  type: 'button',
  children: text,
});

const Button = styled.button.attrs(buttonMap)`
  background-color: white;
  color: black;
  padding: 0.6rem 1rem;
  font-size: 1.3rem;
  border: 2px solid lightgray;
  margin: 0 0.5rem;
  cursor: pointer;
  position: relative;

  &:hover {
    background-color: #f1f1f1;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 4px lightblue;
    border-color: lightblue;
  }

  &[data-selected='true'] {
    border-color: gray;
    background-color: gray;
    color: white;
  }
`;

export const InPlay: React.FC = () => {
  const isWon = useStore($isWon);

  const tubes = useList($tubesWithSelected, ({ balls, over }, position) => (
    <Tube balls={balls} over={over} position={position} onClick={tubeClicked} />
  ));

  return (
    <>
      <Container>{tubes}</Container>
      {isWon && <div>You win!</div>}
    </>
  );
};

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

type TubeProps = {
  balls: Array<BallColor>;
  over: BallColor | null;
  position: number;
  onClick: React.EventHandler<React.MouseEvent<HTMLDivElement>>;
};

const Tube: React.FC<TubeProps> = ({ balls, over, position, onClick }) => (
  <TubeHolder onClick={onClick} data-position={position}>
    <TubeTop>{over !== null ? <Ball ball={over} /> : null}</TubeTop>
    <TubeGlass>
      {balls.map((color, index) => (
        <Ball key={index} ball={color} />
      ))}
    </TubeGlass>
  </TubeHolder>
);

const TubeHolder = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
`;

const TubeTop = styled.div`
  display: flex;
  height: 3rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-bottom: 4px solid lightgray;
`;

const TubeGlass = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  flex-shrink: 0;
  align-items: center;
  border: 2px solid lightgray;
  border-top: none;
  width: 3rem;
  height: 9.8rem;
  padding-bottom: 0.4rem;
  padding-top: 0.4rem;
  border-bottom-left-radius: 2.4rem;
  border-bottom-right-radius: 2.4rem;
`;

interface BallProps {
  ball: BallColor;
}

const colors = [
  'blue',
  'brown',
  'cyan',
  'darkgreen',
  'gray',
  'lightblue',
  'lime',
  'orange',
  'pink',
  'purple',
  'red',
  'yellow',
];

const ballMap = ({ ball }: BallProps) => ({
  style: { '--ball-color': colors[ball] },
});

const Ball: StyledComponent<'div', BallProps, BallProps> = styled.div.attrs(
  ballMap,
)`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 2px solid lightgray;
  background-color: var(--ball-color);
  margin: 1px;
  flex-shrink: 0;
`;
