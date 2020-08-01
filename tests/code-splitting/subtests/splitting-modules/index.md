---
title: Splitting single modules
shortDesc: 'Can modules be split apart based on export usage?'
---

[Code Splitting](/code-splitting) refers to the process of distributing groups of modules into smaller bundles that can be linked together at runtime, avoiding loading code not used by the current state of an application. However, individual modules can grow to be quite large. Some of the most common cases where this is true are "index" modules that re-export many other modules to simplify library usage, or modules that export data like configuration or locale definitions.

When grouping modules, it's common for different subsets of a module's exports to be used by different bundles. In certain cases, it is possible to analyze modules and split them apart based on which exports are needed for each generated bundle. Breaking these large modules apart allows for each group of bundles to contain only the code necessary for that group.
