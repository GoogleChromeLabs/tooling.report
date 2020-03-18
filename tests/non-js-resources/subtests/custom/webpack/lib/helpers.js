export function base64ToBuffer(base64) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (const i of bytes.keys()) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export class CustomType {
  constructor(buffer) {
    this.buffer = buffer;
  }
}
