---
result: pass
---

When targeting the web, hash changes for a bundle shared by multiple entries do not in turn change those entries' bundle hashes. While this may seem like a bug at first, the entry bundles don't actually contain any reference to the shared dependency bundle, and thus their contents do not change when a shared dependency is updated. This is because webpack does not include entry dependency bundle references in entry bundles or its runtime bundle loader, but rather assumes the requisite script loading will be handled by a tool like [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin). This behavior also works when using [`entry.dependsOn`][dependon] to specify shared dependency bundles for each entry.

On the other hand, when targeting Node.js, entry bundles contain references to the shared bundle, as for this target one can't bootstrap the application with parallel `<script>` tags and has to use a single entrypoint. Here changes in referenced bundles affect the entries bundle hashes, but this isn't that relevant in practice as contenthashing is rarely used in Node.js.

[dependon]: https://webpack.js.org/configuration/entry-context/#dependencies
