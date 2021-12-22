export interface F0Return {
  f0: Float64Array;
  time_axis: Float64Array;
}

export class World {
  public dio(x: Float64Array, fs: number, frame_period: number): void;

  public addDioEventListener(listener: { (ret: F0Return): void }): void;

  public harvest(x: Float64Array, fs: number, frame_period: number): void;

  public addHarvestEventListener(listener: { (ret: F0Return): void }): void;

  public addErrorEventListener(listener: { (ev: ErrorEvent): void }): void;
}
