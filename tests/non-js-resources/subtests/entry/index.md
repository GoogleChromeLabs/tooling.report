---
title: Entry points
importance: 1
shortDesc: 'Can the entry point be a non-JavaScript resource?'
---

# Introduction

The term "entry point" is commonly used to refer to the root module in an application's module graph - effctively where JavaScript bundling starts. However, on the Web the "entry point" into an application is always HTML: when navigating to a page, the browser receives an HTML document that controls which resources and scripts are loaded. While JavaScript dominates much of the tooling landscape, there are a number of cases where the process of building or bundling an application can be applicable even if there is no JavaScript present. Much the same as JavaScript bundles can be optimized and their URLs hashed, so can resources depended on by an HTML page and its StyleSheets.

# The Test

This test checks to see if it's possible to use [non-JavaScript resources](/non-js-resources) as the entry point of a build. It builds starting from an HTML file, which contains references to some scripts that need to be bundled and a stylesheet that needs to be transformed.

**index.html**

```html
<!DOCTYPE html>
<link rel="stylesheet" href="./styles.css" />
<script type="module" src="./index.js"></script>
<script src="./util.js"></script>
```

**index.js**

```js
import { logCaps } from './util.js';
logCaps('Oh hello there!');
```

**util.js**

```js
export function logCaps(msg) {
  console.log(msg.toUpperCase());
}
```

**styles.css**

```css
html {
  background: green;
}
```

The output after building should be the processed HTML file, along with one or two JavaScript bundles and a CSS file. The JavaScript and CSS files should have hashed URLs, and the HTML file should be updated with those hashed references.
