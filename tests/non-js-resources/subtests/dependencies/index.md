---
title: Dependencies
importance: 1
shortDesc: 'Resources can depend on other resources'
---

A large part of what makes [importing non-JavaScript resources](/non-js-resources/) compelling is the ability to treat resources as dependencies within an application's module graph. Resources imported as dependencies can be [transformed](/transformations/), have their [URLs hashed](/hashing/), and their usage can be analyzed and taken into account when performing [code splitting](/code-splitting/).

The benefits of introducing resources into the module graph also generally apply to any subresources present in those resources. For example, a CSS StyleSheet can contain references to images, fonts and other stylesheets, all of which can be treated as dependencies. These tests check to see if non-JavaScript resources have their own dependencies, and whether those dependencies avoid common pitfalls like duplication.
