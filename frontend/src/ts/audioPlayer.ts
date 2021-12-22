type AudioPlayerEventType = keyof HTMLMediaElementEventMap | 'prepared';

function isEventListenerObject(
  object: EventListenerOrEventListenerObject
): object is EventListenerObject {
  return 'handleEvent' in object;
}

export class AudioPlayer {
  private readonly context_ = new AudioContext();
  private readonly player_ = new Audio();
  private audioSource_: MediaElementAudioSourceNode | null = null;
  private isPlayable_ = false;
  private currentTime_ = 0;
  private preparedEl_: EventListenerOrEventListenerObject[] = [];

  constructor() {
    // Trigger event after loading the entire audio file
    this.player_.addEventListener('canplaythrough', (ev: Event) => {
      // Pass on on the first call
      if (this.isPlayable_) return;
      this.isPlayable_ = true;
      for (let i = 0; i < this.preparedEl_.length; i++) {
        const el = this.preparedEl_[i];
        if (isEventListenerObject(el)) {
          el.handleEvent(ev);
        } else {
          el(ev);
        }
      }
    });

    // Update current time
    this.player_.addEventListener('timeupdate', () => {
      this.currentTime_ = this.player_.currentTime;
    });

    // Trigger timeupdate event frequently
    const update = () => {
      if (this.currentTime_ !== this.player_.currentTime) {
        this.currentTime_ = this.player_.currentTime;
        this.player_.dispatchEvent(new Event('timeupdate'));
      }
      requestAnimationFrame(update);
    };
    this.player_.addEventListener('loadedmetadata', () => {
      requestAnimationFrame(update);
    });
  }

  public addEventListener(
    type: AudioPlayerEventType,
    listener: EventListenerOrEventListenerObject
  ): void {
    if (type === 'prepared') {
      this.preparedEl_.push(listener);
    } else {
      this.player_.addEventListener(type, listener);
    }
  }

  public loadFile(file: File) {
    this.pause();

    this.isPlayable_ = false;

    this.player_.src = URL.createObjectURL(file);
    this.player_.onloadstart = () => {
      if (this.audioSource_ === null) {
        this.audioSource_ = this.context_.createMediaElementSource(
          this.player_
        );
        this.audioSource_.connect(this.context_.destination);
      }
    };
  }

  public duration(): number {
    return this.isPlayable_ ? this.player_.duration : 0;
  }

  public play() {
    if (this.isPlayable_) this.player_.play();
  }

  public pause() {
    if (this.isPlayable_) this.player_.pause();
  }

  public stop() {
    if (this.isPlayable_) {
      this.player_.pause();
      this.player_.currentTime = 0;
    }
  }

  public getCurrentTime(): number {
    return this.currentTime_;
  }
}
