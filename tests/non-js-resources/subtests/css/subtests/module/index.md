---
title: Module
importance: 1
shortDesc: 'Can CSS "Modules" be used for scoping?'
---

## Introduction

Modularity in CSS is important when composing applications out of independent User Interface components. While CSS does not (yet) provide a syntax for defining modular styles consumable from JavaScript, web developers have rallied around a community-standard [CSS "Module"](https://github.com/css-modules/css-modules) specification.

As defined, CSS Modules have scoped class names and animation names by default, generally implemented as a transformation or prefix on the authored name. The value of a CSS Module imported into JavaScript is a object map of authored class names to their corresponding generated namespaced names:

```js
import styles from './styles.css';
console.log(styles.someClass); // "someClass_X1y2z3"
```

# The Test

This test builds a JavaScript module that imports a CSS file. The CSS import's resulting class name mapping object is used to construct HTML elements that use the namespaced CSS rules.

**index.js**

```js
import styles from './styles.css';
document.body.insertAdjacentHTML(
  'afterend',
  `<div class="${styles.className1}"></div>`,
);
document.body.insertAdjacentHTML(
  'afterend',
  `<div class="${styles.className2}"></div>`,
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

The built result should be a JavaScript bundle and a CSS file, where the CSS class names have been transformed to values that are mapped to their original values within the JavaScript bundle. The CSS must also be minified in order to pass the test.
