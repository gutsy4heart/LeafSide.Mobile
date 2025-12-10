import type { ConfigContext, ExpoConfig } from '@expo/config';

// Expo SDK 54 automatically loads .env file
// But we need to ensure it's read correctly
const apiUrl = process.env.EXPO_PUBLIC_API_URL?.trim() || 'http://192.168.1.69:5233';

// console.log('[app.config] EXPO_PUBLIC_API_URL from process.env:', process.env.EXPO_PUBLIC_API_URL);
// console.log('[app.config] Using API URL:', apiUrl);

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'LeafSide Mobile',
  slug: 'leafside-mobile',
  version: '0.1.0',
  orientation: 'portrait',
  scheme: 'leafside',
  userInterfaceStyle: 'automatic',
  platforms: ['ios', 'android', 'web'],
  extra: {
    apiUrl,
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
  },
  android: {
    package: 'com.leafside.mobile',
    versionCode: 1,
    adaptiveIcon: {
      backgroundColor: '#0b1220',
    },
    permissions: [
      'INTERNET',
      'ACCESS_NETWORK_STATE',
    ],
  },
  web: {
    bundler: 'metro',
    output: 'static',
  },
});

