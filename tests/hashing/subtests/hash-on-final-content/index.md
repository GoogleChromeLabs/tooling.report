---
title: Hash on final file content
importance: 1
shortDesc: 'Are bundle hashes based on final compiled code?'
---

# Introduction

It's possible to make changes to source code that have no effect on the bundled output. Some examples of this include comment and formatting changes, or functionally-equivalent refactoring. The likelihood of these types of changes having no effect on bundled output is higher when code is [transpiled](/transformations/transpile-js) and [minified](/transformations/minify-js).

# The Test

This test builds a single JavaScript module twice, with minification enabled in each tool. The comment text is changed in the second build, which should have no effect on the resulting bundle.

**index.js**

```js
/* This code is copyright 2020 */
console.log('Yay');
```

Since minification removes comments, changing the comment to `2021` does not change the bundled output and should produce the same hashed URL.
