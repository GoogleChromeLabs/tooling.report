import { logCaps } from './utils.js';

new Worker('./worker.js');
logCaps('This is index');
