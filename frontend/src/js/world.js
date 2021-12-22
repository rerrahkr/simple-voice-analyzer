// Interface class for World
export class World {
  constructor() {
    // Initialize event listener list
    this.elDio = [];
    this.elHarvest = [];
    this.elError = [];

    this.worker = new Worker('worker.js');
    // Post-process of calculation
    this.worker.addEventListener('message', (ev) => {
      const { method, ...ret } = ev.data;
      switch (method) {
        case 'dio':
          for (let i = 0; i < this.elDio.length; i++) {
            this.elDio[i](ret);
          }
          break;
        case 'harvest':
          for (let i = 0; i < this.elHarvest.length; i++) {
            this.elHarvest[i](ret);
          }
          break;
      }
    });
    // Rethrow error
    this.worker.addEventListener('error', (ev) => {
      for (let i = 0; i < this.elError.length; i++) {
        this.elError[i](ev);
      }
    });
  }

  dio(x, fs, frame_period) {
    this.worker.postMessage(['dio', x, fs, frame_period]);
  }

  addDioEventListener(listener) {
    this.elDio.push(listener);
  }

  harvest(x, fs, frame_period) {
    this.worker.postMessage(['harvest', x, fs, frame_period]);
  }

  addHarvestEventListener(listener) {
    this.elHarvest.push(listener);
  }

  addErrorEventListener(listener) {
    this.elError.push(listener);
  }
}
