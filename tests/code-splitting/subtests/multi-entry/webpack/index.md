---
result: pass
---

Webpack supports bundling multiple named entries by setting the `entry` configuration option to an object. By default, dependencies shared by entry bundles duplicated in each entry bundle rather than being extracted into a shared bundle. This can cause issues with modules that expect to be instantiated once, such as caches and frameworks.

<details>
<summary>Additional Information</summary>

Setting the `optimization.splitChunks.chunks` configuration option to `"all"` enables the generation of shared bundles for common dependencies. While this works in many applications, it's important to understand that `splitChunks` does not automatically create bundles for all shared dependencies by default. Instead, a set of [threshold conditions] are used to determine when common dependencies should be extracted into a shared bundle. To achieve full shared dependencies as tested here, the bundle size threshold can be effectively disabled by setting `optimization.splitChunks.minSize` to `0`.

Lastly, we need to configure Webpack to load the shared dependency bundles. Webpack currently assumes entry bundles have no dependencies, which means our shared bundles would need to be explicitly loaded on a page. There are many ecosystem tools available to generate the necessary `<script>` tags, and Webpack exposes this information in its [module records data]. However, a truly minimal test should produce bundles for each entry that are capable of loading their own dependencies, requiring only `<script src="profile.js">`.

Thankfully, there is a solution. Webpack relies on a runtime module loader and registry, and the `optimization.runtimeChunk` option provides a way to control where that code should be generated. Setting it to `"single"` produces a `runtime.js` bundle that, when added to the page before the entry bundle, will load any shared bundles on which it depends.

```js
{
  entry: {
    index: './src/index.js',
    profile: './src/profile.js'
  },
  optimization: {
    splitChunks: {
      // extract shared dependencies from entry bundles:
      chunks: 'all',
      // allow any size dependency to be shared:
      minSize: 0
    },
    // create a runtime.js script containing the module loader:
    runtimeChunk: 'single'
  }
}
```

</details>

[threshold conditions]: https://webpack.js.org/plugins/split-chunks-plugin/#defaults
