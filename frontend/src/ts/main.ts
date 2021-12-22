import { World, F0Return } from '../js/world';
import { WaveLoader, WaveData, assertWaveFile } from './waveLoader';
import { AudioPlayer } from './audioPlayer';
import { TimeMeter } from './timeMeter';
import { Logger } from './logger';
import draw, { SeekBar } from './painter';

// Create logger
const logger = ((): Logger => {
  const logPanel = document.getElementById('logPanel');
  const logField = document.getElementById('logField');
  const VISIBLE_ATTR = 'forceVisible';
  const lgr = new Logger();
  lgr.addEventListener('appended', (line?: string) => {
    if (logPanel && !logPanel.classList.contains(VISIBLE_ATTR)) {
      logPanel.classList.add(VISIBLE_ATTR);
    }
    if (logField) logField.innerHTML += `${line}<br>`;
  });
  lgr.addEventListener('finished', (line?: string) => {
    if (logField) logField.innerHTML += line;
    setTimeout(() => {
      lgr.clear();
    }, 500);
  });
  lgr.addEventListener('clear', () => {
    if (logPanel && logPanel.classList.contains(VISIBLE_ATTR)) {
      logPanel.classList.remove(VISIBLE_ATTR);
    }
    if (logField) logField.innerHTML = '';
  });
  return lgr;
})();

const seekBar: SeekBar | null = (() => {
  let sb: SeekBar | null = null;
  function isSvgPathElement(
    element: HTMLElement | SVGPathElement | null
  ): element is SVGPathElement {
    return element instanceof SVGPathElement;
  }

  const elem = document.getElementById('seekBar');
  if (isSvgPathElement(elem)) {
    sb = new SeekBar(elem);
  }
  return sb;
})();

// Create time meter
const timeMeter = ((): TimeMeter => {
  const durElem = document.getElementById('audioDuration');
  const timeElem = document.getElementById('audioCurrentTime');
  const tm = new TimeMeter();
  tm.addEventListener('durationchanged', (sec: number) => {
    if (durElem) durElem.textContent = TimeMeter.convertTimeToString(sec);
  });
  tm.addEventListener('timechanged', (sec: number) => {
    if (timeElem) {
      timeElem.textContent = TimeMeter.convertTimeToString(sec);
      seekBar?.setX(sec);
    }
  });
  tm.reset();
  return tm;
})();

// Initialize wave loader
const loader = ((): WaveLoader => {
  const wl = new WaveLoader();
  const postMessage = logger.createMessanger(WaveLoader.name);
  wl.addEventListener('progress', () => {
    postMessage('Loading an audio binary...');
  });
  wl.addEventListener('load', () => {
    postMessage('Finshed loading an audio binary.');
    logger.finishTarget(wl);
  });
  return wl;
})();

// Declare audio player
let player: AudioPlayer;

// Drag & drop, and file load event settings
{
  const inputButton = document.getElementById('input') as HTMLInputElement;
  const dropArea = document.getElementById('dropArea');
  const dropPanel = document.getElementById('dropPanel');
  const DRAGGING_ATTR = 'dragging';
  const HIDDEN_ATTR = 'forceHidden';

  if (inputButton !== null && dropArea !== null && dropPanel !== null) {
    // File drag event
    dropArea.addEventListener('dragover', (ev: DragEvent) => {
      dropPanel.classList.remove(HIDDEN_ATTR);
      dropPanel.classList.add(DRAGGING_ATTR);
      const dt: DataTransfer | null = ev.dataTransfer;
      if (dt) {
        dt.dropEffect = 'copy';
      }
      ev.preventDefault();
    });

    // File leave event
    dropArea.addEventListener('dragleave', () => {
      dropPanel.classList.remove(DRAGGING_ATTR);
    });

    // File drop event
    dropArea.addEventListener('drop', (ev: DragEvent) => {
      ev.preventDefault();
      dropPanel.classList.remove(DRAGGING_ATTR);

      // Set file to input button and trigger change event
      inputButton.files = ev.dataTransfer?.files ?? null;
      inputButton.dispatchEvent(new Event('change'));
    });

    // File load event
    inputButton.addEventListener('change', () => {
      const files = inputButton.files;
      try {
        if (assertWaveFile(files)) {
          if (player === undefined) {
            // Initialize audio player here
            player = ((): AudioPlayer => {
              const ap = new AudioPlayer();
              const postMessage = logger.createMessanger(AudioPlayer.name);
              ap.addEventListener('progress', () => {
                postMessage('Prepare an audio player...');
              });
              ap.addEventListener('prepared', () => {
                postMessage('Now audio is playable.');
                logger.finishTarget(ap);
                timeMeter.setDuration(ap.duration());
              });
              ap.addEventListener('timeupdate', () => {
                timeMeter.setTime(ap.getCurrentTime());
              });
              return ap;
            })();
          }

          // Hide drop panel
          dropPanel.classList.add(HIDDEN_ATTR);

          // Start logging
          logger.regsterAsTarget(loader);
          logger.regsterAsTarget(player);

          // Load input wave
          loader.loadFile(files[0]);
          player.loadFile(files[0]);
        }
      } catch (error) {
        window.alert((error as Error).message);

        // Reset file data
        inputButton.value = '';
        logger.clear();

        // Display drop panel
        dropPanel.classList.remove(HIDDEN_ATTR);
      }
    });
  }
}

// Play audio
document.getElementById('play')?.addEventListener('click', () => {
  player?.play();
});

// Pause audio
document.getElementById('pause')?.addEventListener('click', () => {
  player?.pause();
});

// Stop audio
document.getElementById('stop')?.addEventListener('click', () => {
  player?.stop();
});

// Analyze
const world = new World();
world.addDioEventListener((f0: F0Return) => {
  console.log(f0);

  //--------------------------------------------
  // const canvas: HTMLElement | null = document.getElementById('panel');
  // if (canvas) {
  //   draw(canvas, f0.f0, f0.time_axis);
  // }
});
world.addErrorEventListener((ev: ErrorEvent) => {
  window.alert(ev.message);
});
document.getElementById('check')?.addEventListener('click', () => {
  const wave: WaveData | undefined = loader?.makeMonaural();
  if (!wave) return;
  console.log(wave);

  const frame_period = 256;
  world.dio(wave.data, wave.rate, frame_period);
});
