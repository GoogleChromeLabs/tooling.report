---
title: Dead code elimination
importance: 1
shortDesc: 'Can unused code paths be removed from bundles?'
---

# Introduction

Bundling modules for production is generally considered to be good for performance, since it allows optimizing the size of JavaScript files based on network and browser constraints rather than an application's structure. However, modules often contain more functionality than is required by an application its current state. These unused code paths aren't necessarily a concern at an individual module level, but when modules are bundle together the amount of unused code often becomes substantial.

[Dead Code Elimination] is the process of removing code that is not used by the current application. Code is parsed to create an [Abstract Syntax Tree] which is then traversed to find unused functions and variables, and finally the tree is converted back to JavaScript source code. There are a number of tools available that can perform Dead Code Elimination on JavaScript source, with the most popular being [Terser] and [Closure Compiler].

# The Test

In this test, each build tool is configured to optimize bundles via its built-in "production" option, or using the most common configuration in cases where there is no such option. Some tools are able to perform Dead Code Elimination as part of bundling, others may rely on other tools like [Terser].

**index.js**

```js
import { logCaps } from './utils.js';
logCaps(exclaim('This is index'));

function thisIsNeverCalled() {
  console.log(`No, really, it isn't`);
}
```

**utils.js**

```js
export function logCaps(msg) {
  console.log(msg.toUpperCase());
}

export function thisIsNeverCalledEither(msg) {
  return msg + '!';
}
```

Once built for _production_, both the `thisIsNeverCalled` and `thisIsNeverCalledEither` functions should be completely removed from the bundle(s).

[dead code elimination]: https://en.wikipedia.org/wiki/Dead_code_elimination
[abstract syntax tree]: https://en.wikipedia.org/wiki/Abstract_syntax_tree
[terser]: https://terser.org/
[closure compiler]: https://github.com/google/closure-compiler
