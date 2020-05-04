---
result: pass
---

Rollup has a [dedicated hook](https://rollupjs.org/guide/en/#resolveimportmeta) for handling properties on `import.meta`, which can be used to easily detect flags. [Terser](https://www.npmjs.com/package/rollup-plugin-terser) handles the dead code elimination.

Alternatively, you could create a virtual module like `import isServer from 'consts:isServer';`. The difference is a virtual module can be code-split, whereas the `import.meta` method will result in the flag value being duplicated throughout the code.

Given that flags are usually booleans, or small primitive values, duplication is usually better for resource size and loading time than module splitting.
