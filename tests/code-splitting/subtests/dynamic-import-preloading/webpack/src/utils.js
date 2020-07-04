import { exclaim } from './exclaim.js';

export function logCaps(msg) {
  if (!msg) return;
  console.log(msg.toUpperCase());
}

export function shout(msg) {
  logCaps(exclaim(msg));
}
