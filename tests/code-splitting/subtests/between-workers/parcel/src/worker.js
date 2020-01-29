import someFunc from './a.js';

console.log(someFunc(40, 2));

addEventListener('message', ev => {
  postMessage(someFunc(ev.data, 4));
});
