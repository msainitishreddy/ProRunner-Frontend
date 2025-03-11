// webpack.config.js
const path = require('path');

module.exports = {
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.mjs'], // Added .mjs for module handling
    fallback: {
      "process": require.resolve("process/browser"),
      "buffer": require.resolve("buffer/"),
      "stream": require.resolve("stream-browserify"),
      "crypto": require.resolve("crypto-browserify"),
      "vm": require.resolve("vm-browserify")
    }
  },
  module: {
    rules: [
      {
        test: /\.m?js/,
        type: 'javascript/auto', // Allows Webpack to correctly handle .mjs files
      }
    ]
  }
};
