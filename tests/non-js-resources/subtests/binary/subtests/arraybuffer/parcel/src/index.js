import textDataUrl from 'data-url:./text.txt';
import binaryDataUrl from 'data-url:./binary.bin';

function decode(data) {
  const [prefix, content] = data.split(',', 2);
  const [, encoding] = prefix.split(';', 2);
  let array;
  if (encoding === 'base64') {
    array = Array.from(atob(content));
  } else {
    array = Array.from(decodeURIComponent(content));
  }
  return new Uint8Array(array.map(v => v.charCodeAt(0))).buffer;
}

console.log('Text via decode():', decode(textDataUrl));
console.log('Binary via decode():', decode(binaryDataUrl));

fetch(textDataUrl)
  .then(r => r.arrayBuffer())
  .then(b => console.log('Text via fetch():', b));

fetch(binaryDataUrl)
  .then(r => r.arrayBuffer())
  .then(b => console.log('Text via fetch():', b));
