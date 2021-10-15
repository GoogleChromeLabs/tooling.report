const { Namer } = require('@parcel/plugin');
const path = require('path');

module.exports = new Namer({
  name({ bundle }) {
    let mainEntry = bundle.getMainEntry();
    if (
      mainEntry != null &&
      path.basename(mainEntry.filePath).includes('unhashed')
    ) {
      return path.basename(mainEntry.filePath);
    }

    return null;
  },
});
