---
title: Hashing
shortDesc: 'Generate hashed URLs for long-term caching'
---

An effective caching strategy is important in order to achieve good page load performance, but it can be tricky to get right. Ideally, resources like scripts and styles should be downloaded once and re-used unless there is an updated version of that resource available. If assets have standard unversioned filenames, we are forced to choose between repeatedly re-requesting those resources to catch new versions, or accepting that a stale cached version may be used even though a new one is available. This tradeoff can also lead to errors in production when updated code is unexpectedly combined with stale code that is functionally different than the current version.

One of the best ways to address these issues is to include version information in asset URLs.

Build tools can generate a version identifier that's unique to the contents of the file. This process is called generating a 'hash', or 'hashing'. When the file contents changes, so does the hash, otherwise it stays the same as a previous build.

Inserting hashes into the filenames of generated assets allows their URLs to be treated as "immutable": a hashed URL never needs to be revalidated to check if it has become stale. Using hashed URLs also ensures references to an asset or bundle always include the expected version of that resource.

When using hashed URLs for non-JavaScript assets, it's often necessary reference those URLs from JavaScript. When the contents of an asset are changed and it gets a new hashed URL, any JavaScript bundles referencing that asset need to be updated to reference the new URL. This changes the contents of those JavaScript bundles, which means their hashed URLs must also change. Ensuring this invalidation "cascade" is set up properly makes it possible to deploy continuously without causing excessive cache invalidation.
