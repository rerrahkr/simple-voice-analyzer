import React, { useState, useEffect, useRef, useCallback } from 'react';

const onInputChanged = (ev: React.ChangeEvent<HTMLInputElement>) => {
  const files = ev.target.files;
};

export const HeaderComponent = (props: { className?: string }) => {
  return (
    <header className={props.className}>
      <input type="file" id="input" accept=".wav" onChange={onInputChanged} />
      {/* transport*/}
      <button type="button" id="play">
        Play
      </button>
      <button type="button" id="pause">
        Pause
      </button>
      <button type="button" id="stop">
        Stop
      </button>
      <input type="button" id="check" value="check" />
      {/* time meter */}
      <span>
        <span id="audioCurrentTime"></span> / <span id="audioDuration"></span>
      </span>
    </header>
  );
};
