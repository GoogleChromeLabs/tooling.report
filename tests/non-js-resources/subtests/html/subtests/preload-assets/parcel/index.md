---
result: pass
---

Parcel uses an HTML file as an entry point. Therefore, developers can add `<link rel="preload">` directly in their HTML. Parcel will take care of updating the referenced URLs to include the proper content hash.
