---
title: Source
importance: 1
---

There are a number of circumstances in which it is useful to be able to import a CSS stylesheet from JavaScript. This test ensures it is possible to obtain the stylesheet's source as a result of importing. In order to pass this test, CSS must also be minified.

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

The resulting bundle should include a JavaScript string containing the minified stylesheet from `styles.css`.
