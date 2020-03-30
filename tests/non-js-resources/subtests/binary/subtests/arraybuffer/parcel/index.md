---
result: partial
issue:
  - https://github.com/parcel-bundler/parcel/issues/4405
---

Parcel 2 has an undocumented feature that you can prefix an import with `data-url:` to turn the contents of an import into a data URL. It seems that depending on the content, Parcel will either URL encoding or use Base64. To turn that data URL into an `ArrayBuffer`, you can either use `fetch()` which automatically detects the encoding but makes this process inherently async or use your own decoder code, as is listed here in the example.
