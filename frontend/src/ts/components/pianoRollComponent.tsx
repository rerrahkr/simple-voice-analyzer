import React from 'react';
import styled from 'styled-components';

// $whiteRowColor: #fffff9;
// $blackRowColor: #fff4ea;
const whiteRowColor = '#f9ffff';
const blackRowColor = '#eaf4ff';
const rowBorderColor = blackRowColor;

const seekBarColor = 'red';

const StyledSvg = styled.svg`
  symbol {
    &#row > * {
      vector-effect: non-scaling-stroke;
    }

    &#octaveRows > * {
      stroke: ${rowBorderColor};

      &.white {
        fill: ${whiteRowColor};
      }
      &.black {
        fill: ${blackRowColor};
      }
    }
  }

  #seekBar {
    stroke: ${seekBarColor};
    vector-effect: non-scaling-stroke;
  }
`;

export const PianoRollComponent = (props: {
  className?: string;
  seekPos?: number;
}) => {
  return (
    <StyledSvg
      className={props.className}
      id="pianoRoll"
      viewBox="0,0,10,420"
      preserveAspectRatio="none"
    >
      <defs>
        <symbol id="row">
          <rect width="10" height="5" />
        </symbol>
        <symbol id="octaveRows">
          <use href="#row" className="white" y="0" />
          <use href="#row" className="black" y="5" />
          <use href="#row" className="white" y="10" />
          <use href="#row" className="black" y="15" />
          <use href="#row" className="white" y="20" />
          <use href="#row" className="black" y="25" />
          <use href="#row" className="white" y="30" />
          <use href="#row" className="white" y="35" />
          <use href="#row" className="black" y="40" />
          <use href="#row" className="white" y="45" />
          <use href="#row" className="black" y="50" />
          <use href="#row" className="white" y="55" />
        </symbol>
      </defs>
      <use href="#octaveRows" y="0" />
      <use href="#octaveRows" y="60" />
      <use href="#octaveRows" y="120" />
      <use href="#octaveRows" y="180" />
      <use href="#octaveRows" y="240" />
      <use href="#octaveRows" y="300" />
      <use href="#octaveRows" y="360" />
      {/* F0 lines */}
      <svg id="f0Layer" viewBox="0,0,10,5" preserveAspectRatio="none">
        <circle cx="0" cy="0" r="5" fill="black" />
      </svg>
      {/* Seek bar */}
      <path id="seekBar" d={`M${props.seekPos ?? 0},0v420`} />
    </StyledSvg>
  );
};
