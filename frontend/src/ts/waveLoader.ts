import './arrayBuffer.extensions';

function getFileExtension(fileName: string): string {
  const idx = fileName.lastIndexOf('.');
  if (idx === -1) return '';
  return fileName.slice(idx + 1).toLowerCase();
}

export function assertWaveFile(files: FileList | null): files is FileList {
  if (files == null) {
    throw new Error('ERROR: Cannot load a file!');
  } else if (files.length !== 1) {
    throw new Error('ERROR: Only 1 file can be read.');
  } else if (getFileExtension(files[0].name) !== 'wav') {
    throw new Error('ERROR: It is not wav file!');
  }
  return true;
}

export class WaveLoader {
  private name_ = '';

  private readonly reader_ = new FileReader();
  private buf_ = new ArrayBuffer(0);
  private isParsable_ = false;

  constructor() {
    this.reader_.addEventListener('load', () => {
      this.buf_ = this.reader_.result as ArrayBuffer;
      this.isParsable_ = true;
    });
  }

  public addEventListener(
    type: keyof FileReaderEventMap,
    listener: EventListenerOrEventListenerObject
  ): void {
    this.reader_.addEventListener(type, listener);
  }

  public loadFile(file: File) {
    this.isParsable_ = false;

    this.name_ = file.name;
    this.reader_.readAsArrayBuffer(file);
  }

  public makeMonaural(): WaveData | undefined {
    if (!this.isParsable_) {
      return undefined;
    }

    const raw: RawWave = parse(this.buf_);
    return makeMonoFloat64(raw);
  }
}

type WaveFormat = 'Int' | 'Float';

interface RawWave {
  rate: number;
  nChannel: number;
  format: WaveFormat;
  bitSize: number;
  data: ArrayBuffer;
}

export interface WaveData {
  rate: number;
  data: Float64Array;
}

function parse(src: ArrayBuffer): RawWave {
  if (src.readString(0, 4) !== 'RIFF') {
    throw new Error('Unsupported file format!');
  }
  const fileSize: number = src.readUint32(4) + 8;
  if (fileSize !== src.byteLength) {
    throw new Error('File is corrupted!');
  }
  if (src.readString(8, 4) !== 'WAVE') {
    throw new Error('Unsupported file format!');
  }

  let pos = 12;
  let rate = 0;
  let nChannel = 0;
  let format: WaveFormat = 'Int';
  let bitSize = 0;
  let data = new ArrayBuffer(0);

  while (pos < fileSize) {
    pos += 4;
    switch (src.readString(pos - 4, 4)) {
      case 'fmt ': {
        const fmtSize = src.readUint32(pos);
        let fmtPos = pos + 4;
        pos = fmtPos + fmtSize;
        switch (src.readUint16(fmtPos)) {
          case 1:
            format = 'Int';
            break;
          case 3:
            format = 'Float';
            break;
          default:
            // Only support linear PCM
            throw new Error('Unsupported file format!');
        }
        fmtPos += 2;
        nChannel = src.readUint16(fmtPos);
        fmtPos += 2;
        rate = src.readUint32(fmtPos);
        fmtPos += 4;
        const byteRate = src.readUint32(fmtPos);
        fmtPos += 4;
        const blockSize = src.readUint16(fmtPos);
        if (byteRate !== blockSize * rate) {
          // Illegal format
          const message =
            'File is corrupted!\n' +
            `Byte rate: ${byteRate}\n` +
            `Block size: ${blockSize}\n` +
            `Sample rate: ${rate}`;
          throw new Error(message);
        }
        fmtPos += 2;
        bitSize = src.readUint16(fmtPos);
        if (![8, 16, 24, 32].includes(bitSize)) {
          throw new Error('Unsupported bit size!');
        }
        if (blockSize !== (nChannel * bitSize) / 8) {
          // Illegal format
          const message =
            'File is corrupted!\n' +
            `Block size: ${blockSize}\n` +
            `Channels: ${nChannel}\n` +
            `Bit size: ${bitSize}`;
          throw new Error(message);
        }
        //fmtPos += 2;
        break;
      }
      case 'data': {
        const dataSize = src.readUint32(pos);
        if (src.byteLength < pos + dataSize) {
          // Illegal format
          throw new Error('File is corrupted!');
        }
        pos += 4;
        data = src.slice(pos, pos + dataSize);
        pos += dataSize;
        break;
      }
      default: {
        pos += src.readUint32(pos) + 4;
        break;
      }
    }
  }

  return {
    rate: rate,
    nChannel: nChannel,
    format: format,
    bitSize: bitSize,
    data: data,
  };
}

class Int24Array {
  private readonly buffer: Int8Array;

  constructor(buffer: ArrayBuffer) {
    this.buffer = new Int8Array(buffer);
  }

  public at(index: number): number | undefined {
    const i = index * 3;
    if (this.buffer.byteLength <= i + 3) {
      return undefined;
    }

    return (
      this.buffer[i] + (this.buffer[i + 1] << 8) + (this.buffer[i + 2] << 16)
    );
  }
}

type TypedArray =
  | Int8Array
  | Int16Array
  | Int24Array
  | Int32Array
  | Float32Array;

function generateTypedArray(
  src: ArrayBuffer,
  bitSize: number,
  format: WaveFormat
): TypedArray {
  switch (format) {
    case 'Int':
      switch (bitSize) {
        case 8:
          return new Int8Array(src);
        case 16:
          return new Int16Array(src);
        case 24:
          return new Int24Array(src);
        case 32:
          return new Int32Array(src);
        default:
          throw new Error('Unsupported format!');
      }
    case 'Float':
      if (bitSize === 32) {
        return new Float32Array(src);
      } else {
        throw new Error('Unsupported format!');
      }
    default:
      throw new Error();
  }
}

function makeMonoFloat64(raw: RawWave): WaveData {
  const byteSize = raw.bitSize / 8;
  const length = raw.data.byteLength / byteSize / raw.nChannel;
  if (!Number.isInteger(length)) {
    throw new Error('Unsupported file format!');
  }

  const data = new Float64Array(length);
  const src = generateTypedArray(raw.data, raw.bitSize, raw.format);
  let di = 0;
  let ri = 0;
  while (di < length) {
    let v = 0;
    for (let j = 0; j < raw.nChannel; j++) {
      v += src.at(ri++) ?? 0;
    }
    data[di++] = v / raw.nChannel;
  }

  return {
    rate: raw.rate,
    data: data,
  };
}
