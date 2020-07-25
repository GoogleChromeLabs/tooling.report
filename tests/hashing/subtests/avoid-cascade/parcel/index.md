---
result: pass
---

If you build HTML pages that reference scripts via `<script src>`, Parcel will use a custom runtime which acts as a registry and loader. This means that dynamically loaded content, such as assets and dynamic imports, can be looked up in the registry.

If you build HTML pages that reference scripts via `<script type="module" src>`, this causes Parcel to output ECMAScript modules rather than use its own loader. This doesn't yet allow for a central registry, though [import maps](https://github.com/WICG/import-maps) may allow for this in the future.
