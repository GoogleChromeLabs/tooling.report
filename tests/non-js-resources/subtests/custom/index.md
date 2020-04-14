---
title: Custom type
importance: 1
---

Can the tool import a custom file as a custom type? This test shows if it's possible (and how difficult it is) to write a plugin yourself.

```js
import customType from 'custom-type:./binary.bin';
console.log(customType);
```

The method of getting `customType` may differ between tests. `customType` must be an instance of class `CustomType`, which has a `buffer` property containing the binary data of `binary.bin`.
