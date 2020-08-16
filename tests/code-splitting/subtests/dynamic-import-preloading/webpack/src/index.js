(() => {
  import('./utilsA.js');
  if (Math.random() < 0.5) {
    import('./utilsB.js');
  }
})();
