---
title: Transpile JS
shortDesc: 'Can JavaScript be transpiled for older browsers?'
---

# Introduction

Transpilation refers to process of [source-to-source compilation], where source code is processed in order to convert it to different source code. Transpilers are essentially compilers that generate code that you could have written yourself. There are a wide variety of tools for transpiling JavaScript, with the majority of applications using popular options like [Babel] or [TypeScript].

Transpilers are prevalent within the JavaScript ecosystem primarily because they make it possible to write code that uses modern JavaScript syntax, without relying on browsers to support that syntax. This approach means developers are free to use syntax based on its applicability to a given task, rather than basing the decision on the set of browsers their application needs to support.

This abstraction comes at a cost: the overwhelming majority of delivered JavaScript is now transpiled to simple-but-verbose syntax that works everywhere, despite 90% of browsers having support for the modern syntax it was transpiled from.

# The Test

This test bundles a module that combines many modern JavaScript syntax features: [block scoping], [async functions], [generators], [spread properties], [async iteration] and [computed properties]. Each bundler is configured to transpile JavaScript code to ECMAScript 5 syntax in order to support older browsers.

**index.js**

```js
async function* lol() {
  yield 1;
  yield 2;
}

async function main() {
  let v = {};
  for await (const x of lol()) {
    v = { ...v, [x]: 'hai' };
  }
  console.log(v);
}
main();
```

The result after building this module should be a bundle containing a transpiled version of the source code that no longer relies on any of the modern syntax features listed above. This is also an opportunity to note the performance cost of over-transpiling code: the bundles produced by each tool are over 10 times larger than the modern source code.

[source-to-source compiler]: https://en.wikipedia.org/wiki/Source-to-source_compiler
[babel]: https://babeljs.io
[typescript]: https://www.typescriptlang.org
[block scoping]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let
[async functions]: https://developers.google.com/web/fundamentals/primers/async-functions
[generators]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*
[spread properties]: https://github.com/tc39/proposal-object-rest-spread
[async iteration]: https://github.com/tc39/proposal-async-iteration#the-async-iteration-statement-for-await-of
[computed properties]: https://exploringjs.com/es6/ch_oop-besides-classes.html#_computed-property-keys-1
