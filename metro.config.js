const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure expo-asset is properly resolved
config.resolver.sourceExts.push('fx');

module.exports = config;

