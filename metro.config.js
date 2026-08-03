const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
    server: {
    // This tells Metro to trust requests coming from your domain
    allowedHosts: ['vynkdating.com', 'localhost'],
  },
};


module.exports = mergeConfig(getDefaultConfig(__dirname), config);
