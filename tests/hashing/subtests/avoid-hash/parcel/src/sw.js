addEventListener('install', ev =>
  ev.waitUntil(new Promise(resolve => setTimeout(resolve, 1000))),
);
