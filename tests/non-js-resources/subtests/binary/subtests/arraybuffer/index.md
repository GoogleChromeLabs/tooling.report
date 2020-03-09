---
title: Array buffer
importance: 1
---

Import a binary and get an array buffer type. This is useful when you need to bring in arbitrary binary data into your web app and have it available synchronously.

The binary data must be represented in an efficient format, such as base64.

```js
import buffer from 'import-binary-somehow';
console.log(buffer.byteLength);
```
