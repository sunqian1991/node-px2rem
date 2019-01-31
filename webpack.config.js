const path = require('path');
// const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    app: './src/app.js',
    Converter: './src/Converter.js',
    convert: './src/convert.js',
    init: './src/init.js',
  },
  output: {
    path: path.resolve(__dirname, './lib'),
    filename: '[name].js',
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, './src')],
        loader: 'babel-loader',
        options: {
          presets: [
            ['env', {
              targets: {
                node: '5.0.0',
              },
            }]],
        },
      },
    ],
  },
  plugins: [
    /* new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, './src/config'),
        to: path.resolve(__dirname, './lib/config'),
      },
    ]), */
  ],
  optimization: {
    minimize: false,
  },
};
