import Constants from 'expo-constants';

// HARDCODED API URL - Change this to your computer's IP address
// For iOS device: use your computer's IP (e.g., http://192.168.1.69:5233)
// For Android emulator: use http://10.0.2.2:5233
// For iOS simulator: use http://127.0.0.1:5233
const HARDCODED_API_URL = 'http://192.168.1.69:5233';

export const getApiBaseUrl = () => {
  // Debug: Log all available sources
  console.log('[Config] === Debugging API URL ===');
  console.log('[Config] HARDCODED_API_URL:', HARDCODED_API_URL);
  console.log('[Config] process.env.EXPO_PUBLIC_API_URL:', process.env.EXPO_PUBLIC_API_URL || '(not set)');
  
  try {
    const configUrl = Constants?.expoConfig?.extra?.apiUrl as string | undefined;
    console.log('[Config] Constants?.expoConfig?.extra?.apiUrl:', configUrl || '(not set)');
  } catch (error) {
    console.warn('[Config] Error reading expoConfig:', error);
  }

  // Use hardcoded URL first (most reliable)
  if (HARDCODED_API_URL) {
    console.log('[Config] ✓ Using HARDCODED API URL:', HARDCODED_API_URL);
    return HARDCODED_API_URL;
  }

  // Fallback: Try expo-constants extra config
  try {
    const configUrl = Constants?.expoConfig?.extra?.apiUrl as string | undefined;
    if (configUrl && configUrl.trim().length > 0 && !configUrl.includes('10.0.2.2')) {
      console.log('[Config] ✓ Using API URL from app.config.ts:', configUrl);
      return configUrl.trim();
    }
  } catch (error) {
    console.warn('[Config] Error reading expoConfig:', error);
  }

  // Fallback: Try environment variable
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl && envUrl.trim().length > 0 && !envUrl.includes('10.0.2.2')) {
    console.log('[Config] ✓ Using API URL from EXPO_PUBLIC_API_URL:', envUrl);
    return envUrl.trim();
  }

  // Last resort fallback
  console.error('[Config] ✗ Using default fallback URL');
  return 'http://192.168.1.69:5233';
};

