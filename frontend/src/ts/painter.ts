function hzToCent(hz: number): number {
  return 1200 * Math.log2(hz / 440) + 5700;
}

function centToHz(cent: number): number {
  return 440 * 2 ** ((cent - 5700) / 1200);
}

const NOTE_NAME: string[] = [
  'C',
  'C#',
  'D',
  'Eb',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'Bb',
  'B',
];

function centToNote(cent: number): string {
  const n = Math.round(cent / 100);
  const octave = Math.floor(n / 12).toString();
  return `${NOTE_NAME[n % 12]}${octave}`;
}

function maxInArray(array: Float64Array): number {
  return array.reduce((a, b) => Math.max(a, b));
}

function minInArray(array: Float64Array): number {
  return array.reduce((a, b) => Math.min(a, b));
}

export class F0Renderer {
  private viewport: SVGElement;
  constructor(elem: SVGElement) {
    this.viewport = elem;
  }

  public drawF0(f0Data: Float64Array, time: Float64Array) {}
}

export default function draw(
  panel: HTMLElement,
  hzF0: Float64Array,
  time_axis: Float64Array
) {
  // const canvas = new Canvas(panel);
  const centF0 = hzF0.map(hzToCent);
  const maxCent = maxInArray(centF0);
  const minCent = minInArray(centF0.filter((v) => v > 0));
  console.log(
    centF0.length,
    maxCent,
    centToNote(maxCent),
    minCent,
    centToNote(minCent)
  );
  // const max = data.reduce((a: number, b: number): number => Math.max(a, b));
  // const path: string = data.reduce(
  //   (prev: string, p: number, idx: number): string =>
  //     `${prev} ${idx},${100 - (p / max) * 100}`,
  //   ''
  // );

  // const element = document.createElementNS(NS_SVG, 'polyline');
  // element.setAttributeNS(null, 'points', path);
  // element.setAttributeNS(null, 'x', '0');
  // element.setAttributeNS(null, 'y', '0');
  // element.setAttributeNS(null, 'fill', 'none');
  // element.setAttributeNS(null, 'stroke', 'red');
  // panel.appendChild(element);
  // canvas.writeObject(
  //   new Rectangle(
  //     { x: 0, y: 40, width: '3rem', height: '60%' },
  //     { class: 'rect' }
  //   )
  // );
}

// class Canvas {
//   private canvas: HTMLElement;

//   constructor(canvas: HTMLElement) {
//     this.canvas = canvas;
//   }

//   public writeObject(obj: Rectangle) {
//     this.canvas.appendChild(obj.element);
//   }
// }

const NS_SVG = 'http://www.w3.org/2000/svg';

interface SeekBarPosition {
  x: number;
  height: number;
}

function dstring(pos: SeekBarPosition): string {
  return `M${pos.x},0v${pos.height}`;
}

const PARSE_REGEXP = /^M(\d+),0v(\d+)$/;

function parsePosition(elem: SVGPathElement): SeekBarPosition {
  const value = elem.getAttributeNS(null, 'd');
  if (value === null) return { x: 0, height: 0 };
  const result = value.match(PARSE_REGEXP);
  if (result === null || result.length !== 3) return { x: 0, height: 0 };
  return {
    x: +result[1],
    height: +result[2],
  };
}

export class SeekBar {
  private elem_: SVGPathElement;
  private pos_: SeekBarPosition;

  constructor(elem: SVGPathElement) {
    this.elem_ = elem;
    this.pos_ = parsePosition(elem);
  }

  public setX(x: number) {
    this.pos_.x = x;
    this.elem_.setAttributeNS(null, 'd', dstring(this.pos_));
  }
}
