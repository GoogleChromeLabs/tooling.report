# To get set up

```sh
npm install
```

# To dev

```sh
npm run dev
```

This starts the build in watch mode, and starts an HTTP server.

# To build for production

```sh
npm run build
```

# Project shape

- `lib` - Various scripts and plugins for the build.
- `static-build` - this script runs at the end of the build process and generates HTML.
- `client` - All client-side JS goes here. It doesn't need to go here, but it keeps it separate from the static generation JS.
- `tests` - Markdown for all the tests and results - see below.

## Test structure

A test directory contains:

- `index.md` - Describes the test or test category. Must include `title` in the front-matter.
- Results for each tool in a folder (`rollup`, `webpack`, `parcel`, `gulp` - all optional) - Each folder contains an `index.md` describing how a particular build tool performs. If no results are present, this directory is considered to be a category only. Each result file requires `result` in the front-matter, which must be 'pass', 'fail' or 'partial'. The folder also contains a minimal project for the respective tool showing how to pass the current test. Build artifacts should be placed in a folder called `build`, as that folder is globally ignored.
- If a test has subtests, the folder must be named `subtests` and contain the structure above.

# Special imports

## Client bundles

```js
import bundleURL, { imports } from 'client-bundle:client/home/index.ts';
```

`client-bundle:` followed by a path to script will bundle and minify that script as an entry point. If two entry points share a module, it'll be code-split.

- `bundleURL` - URL of the bundled script.
- `imports` - URLs of scripts imported by this script (eg for preloading).

This style of import can only be used in `static-build`.

## CSS

```js
import cssURL, { inline, $tabButton } from './styles.css';
```

Imports ending `.css` are assumed to be CSS.

The CSS supports CSS modules, Sass-style nesting, and will be minified.

- `cssURL` - URL to the CSS resource.
- `inline` - The text of the CSS.
- `$*` - Other imports starting with \$ refer to class names within the CSS. So, if the CSS contains `.tab-button`, then `$tabButton` will be one of the exports.

## Markdown

```js
import { html, meta } from 'md:./whatever.md';
```

`md:` followed by a path to some markdown will give you the following:

- `html` - The markdown as HTML.
- `meta` - Metadata from the markdown (Front Matter).

## Other assets

```js
import assetURL from 'asset-url:./foo.png';
```

`asset-url:` followed by a path to a file will add that file to the build.

- `assetURL` - URL to the asset.

## Constants

```js
import isProduction from 'consts:isProduction';
```

If you want to add a constant value, add it to the object passed to `constsPlugin` in `rollup.config.js`. You'll also need to add an entry for it in `missing-types.d.ts`.

## Test data

```js
import tests from 'test-data:';
```

This returns an object representation of everything in the `tests` directory. See `static-build/missing-types.d.ts` for the structure of this object.
