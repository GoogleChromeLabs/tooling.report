import('./utilsA.js').then(response => response.shout('this is index'));
if (Math.random() < 0.5) {
  import('./utilsB.js');
}
