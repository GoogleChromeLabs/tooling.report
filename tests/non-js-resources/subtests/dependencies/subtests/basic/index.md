---
title: Basic
importance: 1
---

It's important to be able to process assets used in stylesheets in order to hash or rebase their URLs, and apply optimizations. This test checks to see if CSS subresources like images and fonts can be processed as part of the build. In order to pass the test, the tool should be able to discover resources and update their usage locations to reflect any transformations.
