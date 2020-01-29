import { hello } from './a';
import Worker from 'worker-loader?name=worker.js!./worker';

hello('main thread');
new Worker();
