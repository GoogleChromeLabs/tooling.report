---
result: partial
---

Parcel 2 has an undocumented feature that you can prefix an import with `data-url:` to turn the contents of an import into a data URL. It seems that depending on the content, Parcel will either encode it as a an `application/octet-stream` that is URL encoded or use Base64.
