import preload from './lib/preload-plugin.js';

export default {
  input: './src/index.js',
  output: {
    dir: 'build',
    format: 'esm',
  },
  plugins: [preload()],
};
