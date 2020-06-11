---
title: Service worker
importance: 1
shortDesc: 'Can asset URLs be injected into Service Workers?'
---

# Introduction

Service Workers are a tool for enhancing web pages with long-lived functionality like offline support and push notifications. Although a service worker _is_ a type of JavaScript dependency, it generally needs to contain information about the build output, like a list of URLs to pass to [`cache.addAll`](https://developer.mozilla.org/en-US/docs/Web/API/Cache/addAll). This information is necessary for "pre-caching" resources that haven't been used yet so that they're available offline in the future.

# The Test

This test bundles an application consisting of one JavaScript module and a stylesheet that references an image. The page registers `sw.js` as its service worker, and each build tool is configured to detect and process this script. The hashed URLs for all assets and the HTML page itself are exposed to `sw.js`, though the mechanism for this varies between tools.

**index.js**

```js
import './styles.css';

navigator.serviceWorker.register('./sw.js');
```

**styles.css**

```js
body {
  background: url('./image.png');
}
```

**image.png**

```
<binary data>
```

**index.html**

```
<!DOCTYPE html>
…
```

**sw.js**

```js
const assets = ['..']; // obtained differently in each tool
const version = 'ab57fcd2'; // obtained differently in each tool

async function install() {
  const cache = await caches.open(version);
  await cache.addAll(assets);
}
addEventListener('install', e => e.waitUntil(install()));

async function activate() {
  const keys = await caches.keys();
  await Promise.all(keys.map(key => key !== version && caches.delete(key)));
}
addEventListener('activate', e => e.waitUntil(activate()));
```

The build result should include a bundled version of `index.js`, the processed stylesheet, and the image asset - all with [hashed URLs](/hashing/). The HTML file and processed service worker script should also be output, without being hashed.

To pass this test, the service worker needs to be aware of the final URL of `index.js`, `styles.css`, `image.png`, and `index.html`.

The service worker should also have access to a variable or identifier that can be used to create a cache name. This identifier should be generated based on the content of all cached files.
