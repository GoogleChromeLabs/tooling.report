---
result: fail
---

Parcel 2 will successfully compile when importing CSS files. However, if you compile a JS file with `parcel build index.js`, the import will just disappear. If you compile an HTML file, it will add a `<link>` tag to the HTML document, but _before_ the doctype, making the page get rendered in quirks mode.

Either way, the import yields a crypting identifier that does not seem usable to get access to the stylesheet’s contents.
