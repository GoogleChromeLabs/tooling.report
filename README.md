# To get set up

```sh
npm i
```

# To dev

```sh
npm run dev
```

# To build for production

```sh
npm run build
```

# Project shape

- `lib` - Various scripts and plugins for the build.
- `static-build` - this script runs at the end of the build process and generates HTML.
- `client` - All client-side JS goes here. It doesn't need to go here, but it keeps it separate from the static generation JS.
- `tests` - Markdown for all the tests and results.

# Test structure

TODO - document 😀

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
import cssURL, { inline } from 'css:./styles.css';
```

`css:` followed by a path to some CSS will add and minify that CSS to the build.

- `cssURL` - URL to the CSS resource.
- `inline` - The text of the CSS.

The CSS can also use Sass-style nesting.

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

TODO: document.
