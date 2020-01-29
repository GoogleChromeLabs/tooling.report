import someFunc from './a.js';

console.log(someFunc(1, 2));
const worker = new Worker('./worker.js');
worker.postMessage(someFunc(20, 3));
