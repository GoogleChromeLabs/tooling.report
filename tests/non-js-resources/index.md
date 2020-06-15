---
title: Non-JavaScript resources
importance: 1
shortDesc: 'Import CSS and other files from JavaScript'
---

Web apps consist of more than just JavaScript. A typical codebase might include HTML documents, CSS StyleSheets, data serialized as JSON or XML, as well as assets like images and fonts. Processing these types of resources individually becomes difficult if the relationship between each resource is not well-defined - references between resources can become out-of-sync when [hashing URLs](/hashing/), and contextualized processing of resources is difficult or impossible.

The prevailing solution is to represent an application as a graph of resources, similar to a module graph for JavaScript but where "module" can be an arbitrary file type. The graph can be used to hold information about each resource, including what resources it depends on. For example, a CSS StyleSheet depends on other stylesheets referenced using `@import`, fonts referenced using `@font-face`, or images used in its CSS rules. This information can be used to modify or even inline resource URLs, or apply usage-based transformations like namespacing CSS.

It's important to note that the inclusion of non-JavaScript resources in the module graph is not currently supported by the JavaScript standard. The [Import Attributes proposal] provides a path toward future standardization, where both bundlers and native modules can use a new `import 'x' with type: 'y'` syntax to safely and consistently import resources into modules.

[import attributes proposal]: https://github.com/tc39/proposal-import-attributes
