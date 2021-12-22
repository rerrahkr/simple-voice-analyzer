type LoggerEventType = 'appended' | 'finished' | 'clear';

type LogMessanger = (message: string) => void;

export class Logger {
  private logList_: string[] = [];
  private listeners_: Record<LoggerEventType, { (message?: string): void }[]> =
    {
      appended: [],
      finished: [],
      clear: [],
    };
  private targets = new Set<object>();

  public addEventListener(
    type: LoggerEventType,
    listener: { (message?: string): void }
  ) {
    this.listeners_[type].push(listener);
  }

  public regsterAsTarget(obj: object) {
    this.targets.add(obj);
  }

  public finishTarget(obj: object) {
    const line = `${new Date().toTimeString()} Ready.`;
    this.targets.delete(obj);
    if (this.targets.size == 0) {
      const el = this.listeners_['finished'];
      for (let i = 0; i < el.length; i++) {
        el[i](line);
      }
    }
  }

  public logMessage(object: string, message: string) {
    const line = `${new Date().toTimeString()}[${object}] ${message}`;
    this.logList_.push(line);
    const el = this.listeners_['appended'];
    for (let i = 0; i < el.length; i++) {
      el[i](line);
    }
  }

  public createMessanger(object: string): LogMessanger {
    return (message: string) => {
      this.logMessage(object, message);
    };
  }

  public clear() {
    this.logList_ = [];
    const el = this.listeners_['clear'];
    for (let i = 0; i < el.length; i++) {
      el[i]();
    }
  }
}
