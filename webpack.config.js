const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: [
    './src/app.js',
  ],
  output: {
    path: path.resolve(__dirname, './lib'),
    filename: 'app.js',
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, './src')],
        loader: 'babel-loader',
        options: {
          plugins: [
            ['transform-runtime', {
              helpers: false,
              polyfill: false,
              regenerator: true,
              moduleName: 'babel-runtime',
            }],
          ],
          presets: ['es2015', 'stage-0'],
          minified: false,
          compact: true,
        },
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, './src/config'),
        to: path.resolve(__dirname, './lib/config'),
      },
    ]),
  ],
  optimization: {
    minimize: false,
  },
};
