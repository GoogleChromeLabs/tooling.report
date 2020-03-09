addEventListener('install', ev => {
  ev.waitUntil(
    (async () => {
      const cache = await caches.open('assets');
      await cache.addAll(['index.html', 'image.png', 'styles.css', 'index.js']);
    })(),
  );
});
