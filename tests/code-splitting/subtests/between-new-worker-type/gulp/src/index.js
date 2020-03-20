const logCaps = require('./util/utils.js');

// note this does not work. Need a way to get a URL based the worker.js
const workerURL = 'worker.js';

new InterestingNewWorkerType(workerURL);
logCaps('This is index');
