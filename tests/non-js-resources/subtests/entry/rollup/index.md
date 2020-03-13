---
result: partial
issue: https://github.com/rollup/rollup/issues/2872
---

Although you can treat HTML as an entry point, you have to fight Rollup to avoid outputting a module. Also, there's no standard way to defer the loading of assets to other plugins, so the plugin that handles the HTML entry point must also know how to load things like CSS.
