import txtURL from 'asset-url:./some-asset.txt';
import { logCaps } from './utils.js';
logCaps('This is profile');
fetch(txtURL).then(async response => console.log(await response.text()));
