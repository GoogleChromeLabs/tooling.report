import { exclaim } from './exclaim.js';
import showProfile from './profile.js';

export function logCaps(msg) {
  if (!msg) return;
  showProfile();
  console.log(msg.toUpperCase());
}

export function shout(msg) {
  logCaps(exclaim(msg));
}
