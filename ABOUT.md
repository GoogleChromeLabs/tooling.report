## Overview

### A health checkup for web build tools.

The web is a complex platform and developing for it can be challenging at the best of times. Build tools aim to make our lives easier by streamlining developer workflows and codifying best-practices. A steady stream of platform and browser changes can make it difficult to identify these best practises and follow as they change. Tooling authors experience this same struggle at a large scale, often with more scrutiny and complexity.

## Goals

We want to help developers _and_ tooling authors. tooling.report is built in collaboration with members of the build tooling teams and hope that we can not only increase the health of the web, but also the quality of life of web developers.

The long-term goal of tooling.report is to improve all build tools. When all tools help developers follow best practices on the web, we have the freedom choose whichever tool we are comfortable with while being confident in the quality of what we ship. In the shorter term, we hope to provide a straightforward guide for selecting which tool to use for new projects, and a reference for incorporating best practices into existing codebases.

## Methodology

The main part of our work consisted of collecting a list of best practices that were identified as being critical for high-quality web development. These were then turned into minimal self-contained tests and reproduced in each build tool. These tests document whether a given tool supports the best-practise, as well as the process by which we arrived at that conclusion. Non-passing tests are also used as reproduction cases in issues filed with the associated tool. We have attempted to ensure the tests are simple and readable so they can be used a concise reference for developers wishing to see _how_ a specific best-practice can be followed each tool.

## Rules

The requirements to pass a test are usually outline in the test’s `index.md`. However, there are some overall rules that apply to all tests:

- **Tests should be user-centric.** The production impact of <abbr title="Developer Experience">DX</abbr> (build times, hot reloading, etc) is indirect and often subjective, so these are not currently represented.
- **Plugins are allowed.** Regardless of who wrote them, including custom one-off plugins.
- **Only documented APIs.** Configuration and custom plugins should use documented APIs. If undocumented usage is required to pass a test, it receives a partial pass.
- **Community standard plugins are preferred.** If a custom plugin is required to pass a test, the result description should link to the best available community plugin and explain why it was not used.
