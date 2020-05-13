---
title: Preloading assets
importance: 1
shortDesc: 'Can preloads be generated for assets like fonts?'
---

# Introduction

When building complex applications, it's easy to end up in a situation where critical resources required for rendering a page aren't referenced in the initial HTML document. This creates a "waterfall" effect, where new critical resources are discovered only once other resources have been downloaded, resulting in sequential network requests that take longer than fetching everything in parallel.

[Preloading critical assets](https://web.dev/preload-critical-assets/) using techniques like `<link rel="preload">` can aleviate this problem without the need to change how resources are loaded. Preloads simply let the browser start downloading required resources earlier so that they're already cached when it comes time to use them.

# The Test

This test checks to see if a build tool provides a way to generate HTML preload links for particular assets, like fonts or images. A JavaScript module and CSS stylesheet with font and image subresources are passed through each build tool, with the necessary configuration or plugins to enable the generation of preload links in that HTML document.

**index.html**

```js
import './styles.css';
console.log('Hello World');
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

The result produced by this test should be five files: an HTML document, the bundled JavaScript and CSS, and the font and image subresources - all with [hashed URLs](/hashing). The generated HTML document should contain `<link rel="preload">` tags for the font and image, with the correct `as` attribute value for each.
