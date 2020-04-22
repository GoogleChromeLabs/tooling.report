---
title: Deduping
importance: 1
---

Bundling CSS containing subresources like images, fonts or additional CSS imports generally involves passing these through the build as their own assets. If a JavaScript bundle also references these assets, it should reference the same asset URL in order to prevent duplication.

**index.js**

```js
import cssURL from './styles.css';
import imgURL from './image.png';
import fontURL from './font.ttf';

console.log({ cssURL, imgURL, fontURL });
```

**styles.css**

```css
@font-face {
  src: url('./font.ttf');
  font-family: 'testfont';
}
body {
  background: url('./image.png');
}
```

The test should produce output files corresponding to `index.js` and `styles.css`, as well as hashed copies of `font.ttf` and `image.png`. Both `index.js` and `styles.css` should reference the same hashed URLs for the two assets.
