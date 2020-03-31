---
title: Deduping
importance: 1
---

Bundling CSS containing subresources like images, fonts or additional CSS imports generally involves passing these through the build as their own assets. If a JavaScript bundle also references these assets, it should reference the same asset URL in order to prevent duplication.
