const path = require('path');

module.exports = {
  entry: './src/sigma/graph.js',
  output: {
    filename: 'graph.bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
  devtool: 'source-map'
};``