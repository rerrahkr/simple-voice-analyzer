import React from 'react';
import styled from 'styled-components';

const whiteNoteColor = 'white';
const blackNoteColor = 'black';
const noteBorderColor = 'gray';

const StyledSvg = styled.svg`
  symbol {
    &#key > * {
      vector-effect: non-scaling-stroke;
    }

    &#octaveKeys > * {
      stroke: ${noteBorderColor};

      &.white {
        fill: ${whiteNoteColor};
      }
      &.black {
        fill: ${blackNoteColor};
      }
    }
`;

export const KeyboardComponent = (props: { className?: string }) => (
  <StyledSvg
    className={props.className}
    id="keyboard"
    viewBox="0,0,10,420"
    preserveAspectRatio="none"
  >
    <defs>
      <symbol id="key">
        <rect width="10" height="5" />
      </symbol>
      <symbol id="octaveKeys">
        <use href="#key" className="white" y="0" />
        <use href="#key" className="black" y="5" />
        <use href="#key" className="white" y="10" />
        <use href="#key" className="black" y="15" />
        <use href="#key" className="white" y="20" />
        <use href="#key" className="black" y="25" />
        <use href="#key" className="white" y="30" />
        <use href="#key" className="white" y="35" />
        <use href="#key" className="black" y="40" />
        <use href="#key" className="white" y="45" />
        <use href="#key" className="black" y="50" />
        <use href="#key" className="white" y="55" />
      </symbol>
    </defs>
    <use href="#octaveKeys" y="0" />
    <use href="#octaveKeys" y="60" />
    <use href="#octaveKeys" y="120" />
    <use href="#octaveKeys" y="180" />
    <use href="#octaveKeys" y="240" />
    <use href="#octaveKeys" y="300" />
    <use href="#octaveKeys" y="360" />
  </StyledSvg>
);
