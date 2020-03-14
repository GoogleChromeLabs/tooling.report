const { stringifyRequest } = require('loader-utils');

module.exports = function(content) {
  // convert the binary data to Base64:
  const base64 = content.toString('base64');

  // Essentially JSON.stringify(path), but converts the path to be project-relative:
  const helpers = stringifyRequest(this, require.resolve('./helpers'));

  return `
    import { CustomType, base64ToBuffer } from ${helpers};
    export default new CustomType(base64ToBuffer("${base64}"));
  `;
};

// skip parsing
module.exports.raw = true;
