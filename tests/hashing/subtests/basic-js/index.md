---
title: Basic JavaScript hashing
importance: 1
shortDesc: 'Are bundle URLs hashed based on their contents?'
---

# Introduction

Will the library hash bundled JavaScript? Does the hash change _only_ when the content of the file changes?

## The Test

This test bundles a single JavaScript module, with hashed URL generation enabled for each tool. The test is run multiple times, with the contents of `index.js` changed for the final run.

**index.js**

```js
console.log('foo'); // "bar" in run 3
```

The result of this test should be a single JavaScript bundle with a hashed URL. Re-running the test without changing `index.js` should result in the same bundle and hash being generated. Re-running the test after changing the contents of `index.js` should output a new bundle with a different hashed URL.
