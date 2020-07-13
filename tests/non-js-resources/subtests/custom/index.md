---
title: Custom type
shortDesc: 'Import custom file types from JavaScript'
---

# Introduction

Many applications rely on custom data types, from serialization schemes like [protobuf] to vendor file formats like [MIDI]. For many of the same reasons it's useful to allow importing other [non-JavaScript resources](/non-js-resources/), the ability to import custom file types as dependences allows them to be integrated into the build process. One key component of this technique is the ability to transform files at build time to "wrap" them in a specific interface.

# The Test

This test tries to demonstrate the most intuitive or idiomatic means of importing a file as a custom type, which differs between each tool. For the purposes of the test, "custom type" is assumed to be some representation of a file for which there is no existing plugin or configuration available. Handling the import generally requires writing a plugin or configuration, so the result of this test takes into account how difficult it would be for a developer to write such a plugin.

```js
import customType from 'custom-type:./binary.bin';
console.log(customType); // an instance of CustomType
```

The implementation details of how `customType` is produced differs between each test, but the result should be the same. The imported `customType` value must be an instance of `CustomType` class, which has a `buffer` property containing the binary data of `binary.bin`.

[protobuf]: https://developers.google.com/protocol-buffers
[midi]: http://www.music.mcgill.ca/~ich/classes/mumt306/StandardMIDIfileformat.html
