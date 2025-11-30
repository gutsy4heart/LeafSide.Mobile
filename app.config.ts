import type { ConfigContext, ExpoConfig } from '@expo/config';

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
    apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:5233',
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#0b1220',
    },
  },
  web: {
    bundler: 'metro',
    output: 'static',
  },
});

