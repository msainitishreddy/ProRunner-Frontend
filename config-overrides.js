// config-overrides.js
const path = require('path');

module.exports = function override(config, env) {
  // Add polyfill support for node core modules
  config.resolve.fallback = {
    process: require.resolve('process/browser'),
    buffer: require.resolve('buffer/'),
    stream: require.resolve('stream-browserify'),
    crypto: require.resolve('crypto-browserify'),
    vm: require.resolve('vm-browserify'),
  };

  // If you have any other custom Webpack settings, you can add them here.
  return config;
};
