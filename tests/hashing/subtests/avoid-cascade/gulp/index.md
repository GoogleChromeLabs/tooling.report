---
result: fail
issue: 'N/A'
---

Please refer js-entry-cascade test. Marking this test fail because hashing is done after browserify run the build, which would change the content regardless of resource name.
This test does not reflect how browserify expects the code to be written.
