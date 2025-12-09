import Constants from 'expo-constants';

const DEFAULT_LOCALHOSTS = ['http://10.0.2.2:5233', 'http://127.0.0.1:5233'];

export const getApiBaseUrl = () => {
  try {
    const explicit =
      Constants?.expoConfig?.extra?.apiUrl ||
      process.env.EXPO_PUBLIC_API_URL ||
      process.env.API_BASE_URL;

    if (explicit && explicit.length > 0) {
      return explicit;
    }
  } catch (error) {
    // Fallback if Constants is not available
    console.warn('expo-constants not available, using environment variables');
  }

  return process.env.EXPO_PUBLIC_API_URL || DEFAULT_LOCALHOSTS[0];
};

