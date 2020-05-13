---
title: Shared objects between entry points
importance: 1
shortDesc: 'Can multiple entry points be used without duplicating modules?'
---

# Introduction

When bundling multi-page websites, [multiple entry points] can be used to create page-specific bundles containing only the JavaScript code necessary for that page. This is an important technique for reducing the impact of JavaScript size on application performance, since it avoids downloading, parsing and compiling code that is ultimately unused by the current page.

Depending on the tool and configuration, modules relied on by multiple entry bundles can be extracted into common bundles used across multiple pages. It is also sometimes the case that modules are used on too few pages to justify being extract into a shared bundle, so a bundler may inline the module into each entry bundle.

Whether extracted or inlined, it's important that a module never be instantiated multiple times - both ECMAScript Modules and CommonJS Modules specify that a module must only be instantiated once per JavaScript context. This guarantee allows a module's top-level scope to be used for global state, shared across all usages of that module. Many libraries rely on this assumption in order to implement important cross-cutting concerns like memoization, queues and plugin registries. Breaking this assumption and instantiating a module multiple times will introduce bugs or inefficiencies in technically correct code.

# The Test

This test checks to see if a module used by two different entry bundles will be instantiated only one time. The shared module exports an object with a numeric `count` property, and each entry module imports the object and increments that property:

**index.html**

```html
<!DOCTYPE html>
<script src="component-1.js"></script>
<script src="component-2.js"></script>
```

**component-1.js**

```js
import obj from './obj.js';
obj.count++;
console.log('component-1', obj.count);
```

**component-2.js**

```js
import obj from './obj.js';
obj.count++;
console.log('component-2', obj.count);
```

**obj.js**

```js
export default { count: 0 };
```

If modules are correctly instantiated only once, both entry modules receive a reference to the same object exported by the shared module, and the `.count` property of that object is incremented twice, resulting in its value being `2`. However, if the common dependency module is instantiated separately by each entry bundle, each will increment its own `.count` property and the result will be two objects each with a `count` value of `1`.

To pass this test, the logged output should be:

```
component-1 1
component-2 2
```

[multiple entry points]: /code-splitting/multi-entry
