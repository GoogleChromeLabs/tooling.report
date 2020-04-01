---
result: pass
---

In Webpack, entry modules are generally JavaScript, and HTML is typically generated using something like [html-webpack-plugin]. It is more difficult to set things up where HTML is the entry format for builds, however it is possible to accomplish by applying a loader that transforms HTML files into JavaScript modules that export the HTML as a string and with assets converted to imports. This introduces the assets into Webpack's module graph, allowing them to be tracked and processed by loaders and plugins.

[html-webpack-plugin]: https://github.com/jantimon/html-webpack-plugin
