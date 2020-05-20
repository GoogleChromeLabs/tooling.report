---
title: Hash on final file content
importance: 1
shortDesc: 'Are bundle hashes based on final compiled code?'
---

# Introduction

When code is [transpiled](/transformations/transpile-js) and [minified](/transformations/minify-js), it's possible to make changes to source code that have no effect on the bundled output. For example, if the minifier is removing comments, changing comments in the source code will have no effect on the output.

Conversely, there are cases where the source is unmodified, but the bundled output changes. For example, the transpiler or minifier may be updated to improve the output.

# The Test

This test builds a single JavaScript module twice, with minification enabled in each tool. The comment text is changed in the second build, which should have no effect on the resulting bundle.

**index.js**

```js
/* This code is copyright 2020 */
console.log('Yay');
```

Since minification removes comments, changing the comment to `2021` does not change the bundled output and should produce the same hashed URL.
