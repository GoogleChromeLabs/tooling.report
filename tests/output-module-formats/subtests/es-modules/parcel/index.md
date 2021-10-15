---
result: pass
issue:
  - url: https://github.com/parcel-bundler/website/issues/631
    status: closed
  - url: https://github.com/parcel-bundler/website/issues/630
    status: closed
  - url: https://github.com/parcel-bundler/parcel/issues/4890
---

Parcel outputs ES modules by default when you use a `<script type="module">` in your HTML file. It uses native dynamic `import()` to load async bundles. It also can create a `nomodule` fallback if a browserslist is configured to include older browsers.