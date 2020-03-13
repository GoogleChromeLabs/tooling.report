const work = require('webworkify');
const logCaps = require('./util/utils.js');

var w = work(require('./worker.js'));
logCaps('This is index');
