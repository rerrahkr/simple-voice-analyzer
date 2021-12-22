import React from 'react';
import styled from 'styled-components';

import { HeaderComponent } from './headerComponent';
import { PianoRollViewComponent } from './pianoRollViewComponent';
import { boxShadow } from './design';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled(HeaderComponent)`
  padding: 1rem;
  background-color: ivory;
  box-shadow: ${boxShadow};
  z-index: 100;
`;

const dragAreaColor = 'rgba(99, 99, 99, 0.2)';
const dragAreaDraggingColor = 'rgba(99, 99, 99, 0.1)';

const logPanelColor = 'white';
const logPanelBGColor = 'black';
const logPanelOpacity = 0.4;

const DropArea = styled.div`
  flex: 1;

  position: relative;
  > * {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;

    &#dropPanel {
      display: flex;
      align-items: center;
      justify-content: center;
      visibility: visible;
      z-index: 100;
      background-color: ${dragAreaColor};

      &.dragging {
        background-color: ${dragAreaDraggingColor};
      }
    }

    &#logPanel {
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${logPanelColor};
      background-color: ${logPanelBGColor};
      visibility: hidden;
      opacity: ${logPanelOpacity};
      z-index: 50;

      #logField {
        max-width: 40rem;
      }
    }
  }

  .forceVisible {
    visibility: visible !important;
  }

  .forceHidden {
    visibility: hidden !important;
  }
`;

export const AppComponent = () => {
  return (
    <Container id="container">
      <Header />

      <DropArea id="dropArea">
        <div id="dropPanel">Please select or drag &amp; drop wav file</div>

        <div id="logPanel">
          <div id="logField"></div>
        </div>

        <PianoRollViewComponent id="pianoRollViewer" />
      </DropArea>
    </Container>
  );
};
