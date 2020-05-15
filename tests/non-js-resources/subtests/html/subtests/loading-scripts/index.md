---
title: Loading scripts
importance: 1
shortDesc: 'Can generated bundles be referenced from HTML?'
---

# Introduction

When using a build tool to bundle or transform JavaScript, the resulting files generally have URLs that are different than those of the original modules they were constructed from. This come as a result of configurable output filename templating, or because the generated URLs contain [hashes](/hashing/) to enable long-term caching. In either case, it's important to be able to update `<script>` tags in an HTML document to reference the correct URLs for generated bundles.

# The Test

This test bundles the scripts referenced by `<script>` tags in an HTML page. For tools that don't support using an HTML file as the "entry" for a build, a plugin is added that adds this functionality. The simple test page contains a single `<script>`, which should be replaced with its bundled URL.

**index.html**

```html
<!DOCTYPE html>
<script src="./index.js"></script>
```

**index.js**

```js
console.log('this is script');
```

After the build completes, two output files should be produced: a JavaScript bundle containing `index.js`, and a copy of `index.html` with the script's `src` updated to reference that bundle's hashed URL.
