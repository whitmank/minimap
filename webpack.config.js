const path = require('path');

module.exports = {
  entry: {
    main: './main.js',
    sidePanel: './src/chrome/sidePanel.js',
    serviceWorker: './src/chrome/service-worker.js',
  },
  output: {
    filename: '[name].bundle.js', // This will generate main.bundle.js and sidePanel.bundle.js
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
  devtool: 'source-map'
};