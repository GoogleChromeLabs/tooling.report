import { logCaps } from './utils.js';
logCaps(exclaim('This is index'));

function thisIsNeverCalled() {
  console.log(`No, really, it isn't`);
}
