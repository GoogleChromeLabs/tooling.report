---
title: Basic
importance: 1
shortDesc: 'Can non-JavaScript resources have dependencies?'
---

## Introduction

Subresources like images and fonts referenced by a CSS StyleSheet are a common example of a dependency relationship where both the dependency and the requestor are non-JavaScript resources. It's important to be able to process assets used by stylesheets in order to [hash](/hashing) or rebase their URLs, and apply optimizations like inlining. Subresources capable of being represented as dependencies can also be found in HTML, SVG, JSON and other formats.

# The Test

This test checks to see if CSS subresources like images and fonts can be processed as part of the build. In order to pass the test, the tool should be able to discover resources and update their usage locations to reflect any transformations, including [URL hashing](/hashing) which is enabled in each tool.

**index.js**

```js
import cssURL from './styles.css';
document.head.insertAdjacentHTML(
  'afterend',
  `<link rel="stylesheet" href="${cssURL}">`,
);
```

**style.css**

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

In addition to the bundled JavaScript, the build result should include each of the three non-JavaScript resources with hashed filenames. The generated CSS file should reference its font and image subresources by their hashed URLs.
