/**
 * Loads an SVG as a JavaScript module with its subresources as require()'s:
 * @example
 * {
 *   test: /\.svg$/,
 *   use: ['file-loader', 'extract-loader', './lib/svg-loader-alt']
 * }
 */
module.exports = function svgLoader(content) {
  this.cacheable(true);

  const pieces = [];
  const tokenizer = /(\shref=)(['"])(.*?)\2/g;
  let offset = 0;
  let match;
  while ((match = tokenizer.exec(content))) {
    const before = content.substring(offset, match.index + match[1].length + 1);
    pieces.push(JSON.stringify(before));
    // todo: entity decoding
    let resource = match[3];
    if (resource.indexOf('/') === -1) resource = './' + resource;
    pieces.push(`require(${JSON.stringify(resource)})`);
    offset = tokenizer.lastIndex - 1;
  }
  pieces.push(JSON.stringify(content.substring(offset)));

  return `module.exports = ${pieces.join('+')}`;
};
