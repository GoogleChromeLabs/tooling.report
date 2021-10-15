---
result: pass
---

Parcel inserts `<script>` elements for the shared dependencies into each HTML page so that they are loaded in parallel with the entry scripts. There is no need for `<link rel="preload">` elements, because the scripts are loaded immediately.
