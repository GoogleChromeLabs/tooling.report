const loaderUtils = require('loader-utils');
const jsdom = require('jsdom');
const RawSource = require('webpack-sources/lib/RawSource');

const ORIGIN = `https://invalid.local`;

function executeModule(source, publicPath) {
  const mod = { exports: {} };
  new Function(
    'module',
    'exports',
    '__webpack_public_path__',
    source.replace(/\bexport\s+default\s+/g, 'module.exports='),
  )(mod, mod.exports, publicPath || '');
  return mod.exports;
}

module.exports = function svgLoader(content) {
  this.cacheable(true);
  const callback = this.async();

  const resources = new Map();
  const ctx = this.context;
  const outputOpts = (this._compiler.options || {}).output || {};
  const filenameTemplate = outputOpts.chunkFilename || outputOpts.filename;

  const DEFAULT_LOADERS = [
    `file-loader?${JSON.stringify({
      name: filenameTemplate,
    })}`,
  ];

  const LOADERS = {
    css: DEFAULT_LOADERS.concat('extract-loader'),
    js: [
      resourcePath =>
        'spawn-loader?' +
        JSON.stringify({
          name: loaderUtils.interpolateName(
            { resourcePath },
            filenameTemplate,
            { context: ctx },
          ),
        }),
    ],
  };

  const emitFile = (source, extract) =>
    new Promise((resolve, reject) => {
      this.addDependency(source);

      const ext = (source.match(/\.([a-z]+)(?:\?.*)?(?:#.*)?$/) || [])[1];
      source =
        (LOADERS[ext] || DEFAULT_LOADERS)
          .map(l => (typeof l === 'function' ? l(source) : l))
          .join('!') +
        '!' +
        source;

      this.loadModule(source, (err, source, map, module) => {
        if (err) return reject(err);

        // get the generated hashed asset URL for the subresource:
        let proxyAsset =
          module.buildInfo.assets && Object.keys(module.buildInfo.assets)[0];

        // ...except for JS, where we use spawn-loader to compile entry modules.
        // Spawn-loader does not produce assets in the parent compiler, instead manually copying them.
        // To obtain the generated URL, we'll need to execute the created intermediary module that exports it:
        if (!proxyAsset) {
          proxyAsset = '' + executeModule(source, outputOpts.publicPath);
        }
        resolve(proxyAsset);
      });
    });

  const resourceLoader = new (class extends jsdom.ResourceLoader {
    constructor(opts) {
      super(opts);
      this.disabled = false;
    }

    fetch(url, options) {
      if (resourceLoader.disabled) return null;

      const originalUrl = url;
      if (url.indexOf(ORIGIN) === 0) url = ctx + url.substring(ORIGIN.length);
      if (url.indexOf('/') === -1) url = './' + url;

      let resource = resources.get(url);

      if (!resource) {
        resources.set(url, (resource = emitFile(url)));
      }

      let key;
      for (let i in options.element) {
        if (options.element[i] === originalUrl) {
          key = i;
          break;
        }
      }

      resource.then(assetUrl => {
        options.element.setAttribute(key, assetUrl);
      });

      return null;
    }
  })();

  const dom = new jsdom.JSDOM(content, {
    url: ORIGIN,
    resources: resourceLoader,
    runScripts: 'dangerously',
  });

  // JSDOM doesn't currently fetch module scripts (unimplemented).
  // We don't care about the type, so we swap them to classic and back to trigger a fetch.
  dom.window.document.querySelectorAll('script[type="module"]').forEach(m => {
    m.setAttribute('type', '');
    m.replaceWith((m = m.cloneNode(true)));
    m.setAttribute('type', 'module');
  });
  resourceLoader.disabled = true;

  Promise.all(Array.from(resources.values()))
    .then(() => {
      const html = dom.serialize();

      // install a hook to rename and extract our HTML
      this._compiler.hooks.emit.tap('html-asset-loader', ({ assets }) => {
        const entry =
          typeof this._compiler.options.entry === 'object'
            ? Object.keys(this._compiler.options.entry)[0]
            : 'main';
        const name = outputOpts.filename.replace('[name]', entry); // todo: hashing
        const htmlName = name.replace(/\.js$/, '.html');
        delete assets[name];
        assets[htmlName] = new RawSource(html);
        // assets[htmlName] = {
        //   size: () => html.length,
        //   source: () => html,
        // };
      });

      // the loader's output is only used to populate `main.js`, which we just deleted.
      callback(null, '');
    })
    .catch(callback);
};

module.exports.raw = true;
