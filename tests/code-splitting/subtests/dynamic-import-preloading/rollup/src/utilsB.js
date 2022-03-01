import { exclaim } from './exclaim.js';
export function logNormal(msg) {
  if (!msg) return;
  console.log(msg);
}
export function shout(msg) {
  logNormal(exclaim(msg));
}
