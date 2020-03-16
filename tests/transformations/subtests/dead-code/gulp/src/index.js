const { logCaps } = require('./utils/utils.js');

logCaps('This is index');

function thisIsNeverCalled() {
  console.log(`No, really, it isn't`);
}
