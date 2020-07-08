---
title: Transformations
shortDesc: 'Apply transformations to code and assets'
---

One of the main reasons we adopt build tooling is to apply transformations to the code and assets that make up an application. Some transformations are general-purpose optimizations that can be applied to a whole application, like [minification] or [compression]. Others are more contextualized, like inlining images or [extracting critical CSS]. There are even fully application-specific transformations, like localization or ahead-of-time compilation.

When an application's code and resources are represented as a graph of dependencies, transformations can be applied based on a resource's type, where it is used, or the way it is referenced. These tests cover some of the most commonly-used transformations.

[minification]: /transformations/minify-js/
[compression]: /transformations/compress-images/
[extracting critical css]: https://web.dev/extract-critical-css/
