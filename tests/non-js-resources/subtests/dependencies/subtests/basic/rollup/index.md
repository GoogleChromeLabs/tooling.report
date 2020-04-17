---
result: pass
---

Plugin authors can use Rollup's [`emitFile` method](https://rollupjs.org/guide/en/#thisemitfileemittedfile-emittedchunk--emittedasset--string) to add assets into the graph.

Although there are Rollup plugins like [rollup-plugin-postcss] to handle CSS, their support for outputting CSS files, and crawling dependencies is spotty. A custom wrapper around [PostCSS](https://postcss.org/) is used in this test.

[rollup-plugin-postcss]: https://github.com/egoist/rollup-plugin-postcss
