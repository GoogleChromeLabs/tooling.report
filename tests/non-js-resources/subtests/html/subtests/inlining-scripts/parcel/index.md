---
result: pass
issue:
  - url: https://github.com/parcel-bundler/website/issues/629
    status: closed
  - url: https://github.com/parcel-bundler/parcel/issues/4855
    fixedSince: 2.0.0-beta.2
    status: closed
---

Putting JavaScript inside of a `<script>` tag will also [inline the resulting bundle into the HTML file](https://v2.parceljs.org/languages/html/#inline-script-and-style-tags):

```html
<!DOCTYPE html>
<script>
  import './whatever.js';
</script>
```
