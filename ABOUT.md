# A health checkup for web build tools.

The web is a complex platform and developing for the web can be challenging at the best of times. Build tools want to make a developer’s life easier by codifying and streamlining knowledge and best practices about the platform. As a developer, the constant stream of changes to browsers, the platform, the underlying protocols can be hard to keep track of, let alone following how these changes affect best practices. Tooling authors have the same struggle, often with more scrutiny and complexity.

## Goals

We want to help developers _and_ tooling authors. tooling.report is built in collaboration with members of the build tooling teams and hope that we can not only increase the health of the web, but also the quality of life of web developers.

The ultimate goal for tooling.report is to improve all the build tools. If all the tools allow developers to follow the best practices on the web, developers can choose the tool that they are most comfortable with while shipping excellent web apps. While that is the long-term goal for tooling.report, the short-term goal is to give web developers a quick and easy way to figure out what the best tool for your next project is and how to adopt a best practice into your existing code base.

## Methodology

The main part of our work consisted of collecting an extensive list of best practices that we think are crucial for high-quality web development and turning them into _tests_. Each best practice was turned into a self-contained for each build tool. The tests are minimal setups that document not only how we came to our conclusion whether or not a build tool supports a certain best practice. We also used the tests are reproduction cases for the bugs we filed whenever a tool did pass a test. At the same time, we made sure the tests are simple and readable, so they can double-function as documentation for web developers who want to see _how_ a specific best practices can be followed with a given build tool

## Rules

The requirements to pass a test are usually outline in the test’s `index.md`. However, there are some overall rules that apply to all tests:

- Tests must be user-centric. This is the reason why DX features like hot-module reloading are currently completely unrepresented.
- Plugins are allowed, regardless of who wrote them.
- Configuration and self-written plugins must use documented APIs only. If undocumented APIs are used, the test can score a partial pass at best.
- If a self-written plugin was necessary to pass a test, the result description should contain a link to the best possible 3rd party plugin with an explanation of where it falls short.
