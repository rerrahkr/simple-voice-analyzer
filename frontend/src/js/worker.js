// Load wasm
importScripts('WorldJS.js');

// Call functions
self.addEventListener('message', (ev) => {
  const [method, ...args] = ev.data;
  switch (method) {
    case 'dio':
      dio(...args);
      break;
    case 'harvest':
      harvest(...args);
      break;
    default:
      throw new Error('Invalid world method name!');
  }
});

function dio(x, fs, frame_period) {
  if (!('Dio_JS' in Module)) {
    throw new Error('WorldJS is still loading!');
  }

  let { f0, time_axis } = Module.Dio_JS(x, fs, frame_period);
  // Reassign array buffers to transfer them
  f0 = new Float64Array(f0);
  time_axis = new Float64Array(time_axis);
  self.postMessage(
    { method: 'dio', f0: f0.buffer, time_axis: time_axis.buffer },
    [f0.buffer, time_axis.buffer]
  );
}

function harvest(x, fs, frame_period) {
  if (!('Harvest_JS' in Module)) {
    throw new Error('WorldJS is still loading!');
  }

  let { f0, time_axis } = Module.Harvest_JS(x, fs, frame_period);
  // Reassign array buffers to transfer them
  f0 = new Float64Array(f0);
  time_axis = new Float64Array(time_axis);
  self.postMessage(
    { method: 'harvest', f0: f0.buffer, time_axis: time_axis.buffer },
    [f0.buffer, time_axis.buffer]
  );
}
