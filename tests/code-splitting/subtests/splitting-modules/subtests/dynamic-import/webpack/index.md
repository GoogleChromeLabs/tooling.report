---
result: fail
---

Webpack inlines the common `objects.js` module as-is into the entry bundle, and the lazy bundle references that copy. While this is a very reasonable behavior, the ideal behavior would have been to "pull apart" the exports of `objects.js` so they can be used independently. No currently tested bundlers pass this test.
