const path = require('path');

module.exports = {
  mode: 'production',
  stats: 'minimal',
  entry: path.resolve(__dirname, 'src/main.js'),
  output: {
    path: path.resolve(__dirname, 'build'),
  },
};
