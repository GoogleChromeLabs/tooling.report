# A health checkup for web build tools.

The web is a complex platform and developing for it can be challenging at the best of times. Build tools aim to make our lives easier by streamlining developer workflows and codifying best-practices. A steady stream of platform and browser changes can make it difficult to identify these best practises and follow as they change. Tooling authors experience this same struggle at a large scale, often with more scrutiny and complexity.

## Goals

We want to help developers _and_ tooling authors. tooling.report is built in collaboration with members of the build tooling teams and hope that we can not only increase the health of the web, but also the quality of life of web developers.

The long-term goal of tooling.report is to improve all build tools. When all tools help developers follow best practices on the web, we have the freedom choose whichever tool we are comfortable with while being confident in the quality of what we ship. In the shorter term, we hope to provide a straightforward guide for selecting which tool to use for new projects, and a reference for incorporating best practices into existing codebases.

## Methodology

The main part of our work consisted of collecting a list of best practices that were identified as being critical for high-quality web development. These were then turned into minimal self-contained tests and reproduced in each build tool. These tests document whether a given tool supports the best-practise, as well as the process by which we arrived at that conclusion. Non-passing tests are also used as reproduction cases in issues filed with the associated tool. We have attempted to ensure the tests are simple and readable so they can be used a concise reference for developers wishing to see _how_ a specific best-practice can be followed each tool.

## Rules

The requirements to pass a test are usually outline in the test’s `index.md`. However, there are some overall rules that apply to all tests:

- Tests must be user-centric. This is the reason why DX features like hot-module reloading are currently completely unrepresented.
- Plugins are allowed, regardless of who wrote them.
- Configuration and self-written plugins must use documented APIs only. If undocumented APIs are used, the test can score a partial pass at best.
- If a self-written plugin was necessary to pass a test, the result description should contain a link to the best possible 3rd party plugin with an explanation of where it falls short.
