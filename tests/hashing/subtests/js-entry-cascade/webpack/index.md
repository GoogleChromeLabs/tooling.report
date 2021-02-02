---
result: pass
---

When targeting the web, hash changes for a bundle shared by multiple entries do not in turn change those entries' bundle hashes. While this may seem like a bug at first, the entry bundles don't actually contain any reference to the shared dependency bundle, and thus their contents do not change when a shared dependency is updated. This is because webpack does not include entry dependency bundle references in entry bundles or its runtime bundle loader, but rather assumes the requisite script loading will be handled by a tool like [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin). This behavior also works when using [`entry.dependsOn`][dependon] to specify shared dependency bundles for each entry.

When targeting Node.js, entry bundles reference and load shared bundles directly, since parallel loading via `<script>` is not possible. This means shared bundle changes affect entry bundle hashes, however filename hashing has limited applicability in this context.

[dependon]: https://webpack.js.org/configuration/entry-context/#dependencies
