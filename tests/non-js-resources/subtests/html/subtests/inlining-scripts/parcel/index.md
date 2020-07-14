---
result: partial
issue:
  - url: https://github.com/parcel-bundler/website/issues/629
  - url: https://github.com/parcel-bundler/parcel/issues/4855
---

Parcel has an undocumented way to do this:

```html
<!DOCTYPE html>
<script src="whatever.js">
```

The above will result in a separate resource for the script. However:

```html
<!DOCTYPE html>
<script>
  import './whatever.js';
</script>
```

The above will _inline_ the script into the page.

However, this creates inline sourcemaps in your code, which will inflate the size of your JavaScript in production. The only way to avoid this is to disable sourcemaps altogether.
