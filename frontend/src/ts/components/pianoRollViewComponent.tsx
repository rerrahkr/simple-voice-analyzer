import React from 'react';
import styled from 'styled-components';

import { KeyboardComponent } from './keyboardComponent';
import { PianoRollComponent } from './pianoRollComponent';
import { boxShadow } from './design';

const StyledDiv = styled.div`
  display: flex;
`;

const Keyboard = styled(KeyboardComponent)`
  width: 20%;
  height: 100%;
  min-width: 1rem;
  max-width: 6rem;
  box-shadow: ${boxShadow};
  z-index: 1;
`;

const PianoRoll = styled(PianoRollComponent)`
  flex: 1;
  z-index: 0;
`;

export const PianoRollViewComponent = (props: {
  id?: string;
  className?: string;
  seekPos?: number;
}) => (
  <StyledDiv className={props.className}>
    <Keyboard />
    <PianoRoll seekPos={props.seekPos} />
  </StyledDiv>
);
