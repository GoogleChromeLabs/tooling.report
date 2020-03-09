import { logCaps } from './utils.js';

async function main() {
  const { exclaim } = await import('./exclaim.js');
  logCaps(exclaim('This is index'));
}
main();
