---
title: Compress SVG
importance: 1
shortDesc: 'Can SVGs be optimized automatically?'
---

# Introduction

It's become relatively common to "import" SVG files from JavaScript, either to obtain a generated asset URL for the SVG or to inline its contents as a string. In both cases, it's important to be able to process imported SVG assets to minimize their network or bundle size impact.

# The Test

This test builds an application consisting of a JavaScript module that imports an SVG image. Each build tool is configured to pass the SVG though an optimization step, generally [SVGO].

**index.js**

```js
import svgUrl from './vector.svg';
console.log(svgUrl);
```

**vector.svg**

```html
<svg
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  viewBox="0 0 1000 1000"
>
  <text x="50" y="50">Ohai</text>
</svg>
```

The build result should be a JavaScript bundle created from `index.js`, where `svgUrl` is now the generated URL for `vector.svg`. The SVG should be optimized, which should produce a version with whitespace and unnecessary attributes removed:

```html
<svg xmlns="http://www.w3.org/2000/svg"><text x="50" y="50">Ohai</text></svg>
```

[svgo]: https://github.com/svg/svgo
