const { Transformer } = require('@parcel/plugin');

module.exports = new Transformer({
  transform(...args) {
    console.log(args);
    return [];
  },
});
