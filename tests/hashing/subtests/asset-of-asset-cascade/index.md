---
title: Asset-of-asset hash cascading
importance: 1
---

Some asset types can have their own dependencies. For example CSS & SVGs are usually considered assets, but can themselves reference, images, fonts or stylesheets:

```css
body {
  background-image: url(background.jpg);
}
```

In this example, if `background.jpg` changes, the hash of `background.jpg` needs to change and in consequence, the hash of the CSS file should change as well.
