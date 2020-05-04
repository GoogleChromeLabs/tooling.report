---
result: pass
---

The official plugin [@rollup/plugin-replace](https://www.npmjs.com/package/@rollup/plugin-replace) allows you to perform simple replacements within code. Rollup also applies some dead-code elimination without using a minifier, so you can see that unreachable code is removed without needing to read minified code.

Alternatively, you could create a virtual module like `import isServer from 'consts:isServer';`. The difference is a virtual module can be code-split, whereas the @rollup/plugin-replace method will result in the flag value being duplicated throughout the code.

Given that flags are usually booleans, or small primitive values, duplication is usually better for resource size and loading time than module splitting. If the 'flag' value is more like a larger JavaScript object, then a virtual import becomes a better method.
