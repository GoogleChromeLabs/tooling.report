---
title: URL
importance: 1
shortDesc: 'Can CSS be imported to produce a stylesheet URL?'
---

## Introduction

Importing CSS from JavaScript and getting back a URL is a convenient way let the browser handle the work of downloading and applying stylesheets, while still being able to control when and where that work happens. CSS has a smaller per-byte performance impact than JavaScript, so it's often a good idea to avoid [inlining CSS into JavaScript bundles](/non-js-resources/css/source).

In the future, it may be possible to explicitly specify how a non-JavaScript import should be handled using something like [Module Attributes](https://github.com/tc39/proposal-module-attributes).

# The Test

In this test, a CSS file is imported by a JavaScript module, resulting in the stylesheet being processed by the build tool and a URL returned. That URL can then be injected into the page using `<link rel=stylesheet>`.

**index.js**

```js
import cssUrl from './styles.css';
document.head.insertAdjacentHTML(
  'afterend',
  `<link rel="stylesheet" href="${cssUrl}">`,
);
```

**styles.css**

```css
.class-name-1 {
  color: green;
}
.class-name-2 {
  background: green;
}
```

The resulting bundle should include the generated CSS URL, available to the module as `cssURL`. The stylesheet should also be minified (rules deduplicated, whitespace removed, etc) in order to pass this test.
