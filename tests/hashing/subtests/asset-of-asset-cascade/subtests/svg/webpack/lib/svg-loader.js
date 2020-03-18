module.exports = function svgLoader(content) {
  this.cacheable(true);
  const callback = this.async();

  let id = 0;
  const resources = new Map();

  content = content.replace(/(\shref=)(['"])(.*?)\2/g, (s, pre, quote, url) => {
    // href="bg.svg" --> href="./bg.svg"
    if (url.indexOf('/') === -1) url = './' + url;

    let placeholder = resources.get(url);
    if (!placeholder) {
      placeholder = `__SVG_RESOURCE_${id++}__`;
      resources.set(url, placeholder);
    }
    return pre + quote + placeholder + quote;
  });

  const cfg = (this._compiler && this._compiler.options) || {};
  const publicPath = (cfg && cfg.output && cfg.output.publicPath) || '';

  const pending = [];
  for (const [url, placeholder] of resources) {
    pending.push(
      new Promise((resolve, reject) => {
        this.loadModule(url, (err, source, map, module) => {
          if (err) return reject(err);
          // get the generated hashed asset URL for the subresource:
          const assetUrl = Object.keys(module.buildInfo.assets)[0];
          // replace all corresponding placeholders with that URL:
          content = content.replace(
            new RegExp(placeholder, 'g'),
            publicPath + assetUrl,
          );
          resolve();
        });
      }),
    );
  }

  Promise.all(pending)
    .then(() => callback(null, content))
    .catch(callback);
};
