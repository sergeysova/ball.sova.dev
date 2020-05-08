/* eslint-disable react/no-array-index-key */
import * as React from 'react';
import { useStore, useList } from 'effector-react';
import styled, { StyledComponent } from 'styled-components';
import { BallColor, $state, $tubesSelected, startClicked } from './model';

export const HomePage: React.FC = () => {
  const state = useStore($state);
  React.useEffect(() => {
    startClicked(undefined as any);
  }, []);

  if (state === 'start') {
    return (
      <button type="button" onClick={startClicked}>
        Start game
      </button>
    );
  }
  if (state === 'won') {
    return <div>You win!</div>;
  }

  return <InPlay />;
};

export const InPlay: React.FC = () => {
  const tubes = useList($tubesSelected, ({ balls, over }) => (
    <Tube balls={balls} over={over} />
  ));
  return <Container>{tubes}</Container>;
};

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

type TubeProps = {
  balls: Array<BallColor>;
  over: BallColor | null;
};

const Tube: React.FC<TubeProps> = ({ balls, over }) => (
  <TubeHolder>
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
