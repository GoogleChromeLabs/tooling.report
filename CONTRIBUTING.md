# Contributing to tooling.report

tooling.report is built around open-source projects and built with open-source projects. We stand on the shoulders of giants and on many hours of work done by members of the web development community. We hope that tooling.report itself adds value to the community, but also encourage and welcome anyone who wants to contribute to tooling.report. Contributions to tooling.report can be broken down into three main groups: _Contributing a new tool to the report_, _contributing a new test to the report_ and _contributing to the site_.

## Contributing a new test

The web platform is ever-changing and best practices change along with it due to the evolution of protocols (e.g. HTTP/1 vs HTTP/2), browser capabilities (e.g. [import maps](https://www.youtube.com/watch?v=yOcgGSCrn-c)), file formats (e.g. JPEG vs WebP vs AVIF etc) and developer tooling. If you have an idea for a new test, the first step is to [open an issue](https://github.com/GoogleChromeLabs/tooling.report/issues/new/choose) and outline in which scenarios the _user of a web app_ would measurably benefit from a tool passing this test. Once the discussion has concluded that this test is a valuable addition to tooling.report, a PR should be opened implementing the test for the set of tools listed in tooling.report. We can’t expect everyone to be comfortable with every build tool, so each tool-specific test will be reviewed by dedicated experts of that tool

## Contributing a new tool

The first version of tooling.report focuses on [Browserify](http://browserify.org/) + [Gulp](https://gulpjs.com/), [Parcel](https://parceljs.org/), [Rollup](https://rollupjs.org/) and [webpack](https://webpack.js.org/). The main goal of tooling.report is to help developers find the best tool for their next project or make the most of the tool they already use, and as such it is vital that we expand tooling.report to cover more tools over time.

### Choosing the next tool

There are _many_ build tools out there. We haven’t yet established quantitative rules on which tools are eligible to be listed on tooling.report, but the guiding principle is to maximize _helpfulness_ of tooling.report. While the core team will have the final call on whether any given tool should get listed on tooling.report, we strive to publicize and democratize the process via GitHub issues and the [project board](https://github.com/GoogleChromeLabs/tooling.report/projects/2). If you plan to add a tool to tooling.report, please [file an issue](https://github.com/GoogleChromeLabs/tooling.report/issues/new) so it can be discussed before you put hours of work into it.

### Gathering the data

Once you have agreement that a tool should be represented on the site, next step is to add its name to the top-level [`config.js`](https://github.com/GoogleChromeLabs/tooling.report/blob/dev/config.js). From here on in, every test in the `tests` folder is expected to have a dedicated folder with the tool's name. That folder must contain an `index.md` with the test results and a self-contained, _minimal_ setup demonstrating how the tool needs to be set up to pass the test. The test project should have a dedicated `package.json` with a `build` npm script that invokes the build tool. Whether the build output is considered a pass or a fail is determined by manual inspection and sometimes requires additional context or justification. All of this should be put into an accompanying `index.md` that has the following structure:

```markdown
---
result: fail # must be "pass", "partial" or "fail"
issue:
  - url: https://github.com/surma/the-fancy-new-buildtool/issues/1337
    fixedSince: fnbt@0.3.2 # optional
    status: closed # optional
  - url: https://github.com/surma/the-fancy-new-buildtool/issues/1338
---

Surma’s tool _says_ it is the best file size optimizer in the market, but it appends a self-aggrandizing comment banner to every file that repeatedly links to various HTTP203 video episodes, unnecessarily inflating file size.
```

Tests that are not a pass _must_ link to at least one open issue. It is strongly recommended to look at the other tools’ test projects and align with them as closely as possible. If possible, tools should try to use the same set of source files for a given test.

## Contributing to the site

The site’s goal is to visualize the state of the build tool ecosystem. The [repository’s README](https://github.com/GoogleChromeLabs/tooling.report#readme) gives an introduction on how the site is built and how it works. As with all contributions, it is a good idea to [open an issue](https://github.com/GoogleChromeLabs/tooling.report/issues/new/choose first proposing your change before spending time on implementing it.

## Community Guidelines

This project follows [Google's Open Source Community
Guidelines](https://opensource.google.com/conduct/).

## Contributor License Agreement

Contributions to this project must be accompanied by a Contributor License
Agreement. You (or your employer) retain the copyright to your contribution,
this simply gives us permission to use and redistribute your contributions as
part of the project. Head over to <https://cla.developers.google.com/> to see
your current agreements on file or to sign a new one.

You generally only need to submit a CLA once, so if you've already submitted one
(even if it was for a different project), you probably don't need to do it
again.
