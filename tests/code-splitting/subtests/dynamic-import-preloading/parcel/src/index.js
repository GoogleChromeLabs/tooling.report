import 'regenerator-runtime/runtime';
setTimeout(async () => {
  const { shout } =
    Math.random() < 0.5
      ? await import('./utilsA.js')
      : await import('./utilsB.js');
  shout('this is index');
}, 6000);
