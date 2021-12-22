export {};

declare global {
  interface ArrayBuffer {
    readUint8(byteOffset: number): number;
    readUint16(byteOffset: number): number;
    readUint32(byteOffset: number): number;
    readString(byteOffset: number, length: number): string;
  }
}

ArrayBuffer.prototype.readUint8 = function (byteOffset: number): number {
  return new Uint8Array(this.slice(byteOffset, byteOffset + 1))[0];
};

ArrayBuffer.prototype.readUint16 = function (byteOffset: number): number {
  return new Uint16Array(this.slice(byteOffset, byteOffset + 2))[0];
};

ArrayBuffer.prototype.readUint32 = function (byteOffset: number): number {
  return new Uint32Array(this.slice(byteOffset, byteOffset + 4))[0];
};

ArrayBuffer.prototype.readString = function (
  byteOffset: number,
  length: number
): string {
  return new TextDecoder().decode(this.slice(byteOffset, byteOffset + length));
};
