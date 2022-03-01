Better tree shaking helps in dead code elimination, thus keeping the bundle size small. But the modules which contain [side-effects](https://softwareengineering.stackexchange.com/questions/40297/what-is-a-side-effect) cannot be tree-shaken. Although bundlers do their best to analyze if a module contains any side-effect, but sometimes it can be tricky. So to err on the side of caution, bundlers skip tree shaking of the modules in certain situations. As developers, we can help bundlers to make better judgement about the tree-shakability of module by adding the pure annotation.

Pure annotation is a comment `/*#__PURE__*/` which would tell the bundler that the module contains no side-effect and is safe to be tree-shaken.

For example,

index.js

```js
import { bar } from './lib.js';
console.log(bar);
```

lib.js

```js
function createDatabaseConnection() {
  console.log('connecting!');
  return {};
}

export const foo = /*#__PURE__*/ createDatabaseConnection();
export const bar = 'bar';
```

In above example, to omit `createDatabaseConnection()` from final chunk, we need to add pure annotation. But be careful, if any other module in the app depends on the side-effect performed by the annotated module, then your app might break in unexpected ways.

Reference: https://medium.com/webpack/better-tree-shaking-with-deep-scope-analysis-a0b788c0ce77
