---
title: Deduping
shortDesc: 'Are JS and non-JS dependencies de-duplicated?'
---

# Introduction

Bundling CSS containing subresources like images, fonts or additional CSS imports generally involves passing these through the build as their own assets. If a JavaScript bundle also references these assets, it should reference the same asset URL in order to prevent duplication.

# The Test

This test bundles a JavaScript module and a CSS StyleSheet that both refer to the same image and font as dependencies.

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

**font.ttf**

```
<binary data>
```

**image.png**

```
<binary data>
```

The test should produce four output files: the bundled JavaScript from `index.js`, processed CSS from `styles.css`, and copies of `font.ttf` and `image.png`. The filenames for each resource should contain hashes, and both `index.js` and `styles.css` should reference the same hashed URLs for the two assets.
