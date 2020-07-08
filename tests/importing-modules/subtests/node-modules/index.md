---
title: Import from `node_modules`
shortDesc: 'Can dependencies be imported from node_modules?'
---

# Introduction

The most common way to distribute and consume front-end packages is through [the npm registry](https://www.npmjs.com). Projects are generally set up such that bare import specifiers (imports that aren't file paths) are resolved to installed packages by looking up the corresponding package name and path within a directory like `node_modules`. The specifics of how resolution occurs tends to vary between different configurations, tools and runtimes, however most are based on the [Node.js module resolution algorithm](https://nodejs.org/api/modules.html#modules_all_together). In its simplest form, bare specifiers are resolved using one or more entry mappings provided by a `package.json` description file generally located at the root of each module.

A number of community standards for denoting entry module mappings have evolved over the past 10 years, making the details of this process a point of confusion for many developers. Many packages specify multiple source variations in `package.json` fields like `"module"` or `"browser"` in order to allow tools to select the most appropriate version for a given target environment. More recently, Node.js formalized [Export Maps](https://nodejs.org/api/esm.html#esm_conditional_exports) to address these use-cases, and support is now making its way into build tooling. Export Maps require package authors to explicitly declare all importable paths in an `"exports"` field within `package.json`, avoiding the need for filesystem traversal during module resolution.

The ability to resolve modules installed from a centralized registry is at the heart of JavaScript's dependency-centric ecosystem. It has been suggested that installed dependencies make up more than 50% of the compiled code in modern JavaScript applications. This means a build tool's ability to optimize for imported third party modules is important for ensuring high-quality output.

# The Test

In this test, a dependency called [idb](https://www.npmjs.com/package/idb) is installed using npm, resulting in a `node_modules/idb` directory. The module's `package.json` includes `"main"` and `"module"` fields, defining its CommonJS and ECMAScript Modules entry files. Since the dependency is imported using modern syntax, the corresponding ECMAScript Modules source for `idb` should be used.

**index.js**

```js
import { openDB } from 'idb';
console.log(openDB('lol', 1));
```

The output of building the above file with its `"idb"` import should be a bundle containing both the authored code and the imported dependency module. Since the `idb` package exposes ECMAScript Modules source under the `"module"` field, the resulting bundle should ideally be tree-shaken to exclude its unused exports.
