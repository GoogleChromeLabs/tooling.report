---
title: Source
shortDesc: 'Can CSS be imported as a JavaScript string?'
---

# Introduction

There are a number of circumstances in which it is useful to be able to import a CSS stylesheet from JavaScript. One of the most common use-cases is to load styles for a reusable UI component library, which generally requires that the stylesheet can be imported as a JavaScript string.

In the future, it may be possible to explicitly specify how a non-JavaScript import should be handled using something like [Module Attributes](https://github.com/tc39/proposal-module-attributes).

# The Test

In this test, a CSS file is imported by a JavaScript module and its string representation is injected into a `<style>` element, applying the style rules to the page.

**index.js**

```js
import css from './styles.css';

// do something with the stylesheet text:
const style = document.createElement('style');
style.textContent = css;
document.head.append(style);
```

**styles.css**

```css
html {
  background: green;
}

h1 {
  color: white;
}
```

The resulting bundle should include a JavaScript string containing the stylesheet from `styles.css`. The stylesheet string should also be minified (rules deduplicated, whitespace removed, etc) in order to pass this test.
