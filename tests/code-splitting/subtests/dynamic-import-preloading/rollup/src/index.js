import('./utilsA.js').then(importedModule =>
  importedModule.shout('this is index'),
);
if (Math.random() < 0.5) {
  import('./utilsB.js');
}
