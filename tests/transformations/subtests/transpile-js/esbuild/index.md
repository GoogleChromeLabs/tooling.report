---
result: partial
issue: https://github.com/evanw/esbuild/issues/297
---

esbuild supports transpiling Javascript and Typescript code. However, it lacks a few transforms when targeting ES5 build targets. The output of esbuild can be passed to babel, but esbuild does not provide any mechanism to achieve that.
