type TimeMeterEventType = 'timechanged' | 'durationchanged';

export class TimeMeter {
  private time_ = 0;
  private duration_ = 0;

  private eventListener_: Record<
    TimeMeterEventType,
    { (sec: number): void }[]
  > = {
    durationchanged: [],
    timechanged: [],
  };

  public addEventListener(
    type: TimeMeterEventType,
    listener: { (sec: number): void }
  ) {
    this.eventListener_[type].push(listener);
  }

  public setTime(sec: number) {
    this.time_ = sec;
    // Trigger event
    const el = this.eventListener_.timechanged;
    for (let i = 0; i < el.length; i++) {
      el[i](sec);
    }
  }

  public getTime(): number {
    return this.time_;
  }

  public setDuration(sec: number) {
    this.duration_ = sec;
    // Trigger event
    const el = this.eventListener_.durationchanged;
    for (let i = 0; i < el.length; i++) {
      el[i](sec);
    }
  }

  public getDuration(): number {
    return this.duration_;
  }

  public reset() {
    this.setTime(0);
    this.setDuration(0);
  }

  public static convertTimeToString(time = 0) {
    if (time < 0) throw new Error('Invalid argument.');
    const m: number = Math.floor(time / 60);
    const s: number = Math.floor(time) % 60;
    const ms: number = Math.round((time * 100) % 60);
    return `${m}:${pad0(s, 2)}:${pad0(ms, 2)}`;
  }
}

function pad0(n: number, width: number): string {
  return n.toString().padStart(width, '0');
}
