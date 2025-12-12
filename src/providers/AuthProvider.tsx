import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  getProfile,
  login,
  register,
  updateProfile as updateProfileRequest,
} from '@/services/auth';
import type {
  LoginPayload,
  RegisterPayload,
  UpdateProfilePayload,
  UserProfile,
} from '@/types/user';

const TOKEN_KEY = '@leafside/token';

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'anonymous';

interface AuthContextValue {
  status: AuthStatus;
  token: string | null;
  profile: UserProfile | null;
  authReady: boolean;
  signIn: (payload: LoginPayload) => Promise<void>;
  signUp: (payload: RegisterPayload) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [status, setStatus] = useState<AuthStatus>('idle');
  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const hydrate = async () => {
      try {
        setStatus('loading');
        const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
        if (storedToken) {
          setToken(storedToken);
          const currentProfile = await getProfile(storedToken);
          setProfile(currentProfile);
          setStatus('authenticated');
        } else {
          setStatus('anonymous');
        }
      } catch {
        setToken(null);
        setProfile(null);
        setStatus('anonymous');
      } finally {
        setAuthReady(true);
      }
    };

    hydrate();
  }, []);

  const persistToken = useCallback(async (value: string | null) => {
    if (!value) {
      await AsyncStorage.removeItem(TOKEN_KEY);
      return;
    }

    await AsyncStorage.setItem(TOKEN_KEY, value);
  }, []);

  const signIn = useCallback(async (payload: LoginPayload) => {
    setStatus('loading');
    try {
      const response = await login(payload);
      setToken(response.token);
      await persistToken(response.token);
      const profileResponse = await getProfile(response.token);
      setProfile(profileResponse);
      setStatus('authenticated');
    } catch (error) {
      setStatus('anonymous');
      setToken(null);
      setProfile(null);
      await persistToken(null);
      throw error;
    }
  }, [persistToken]);

  const signUp = useCallback(
    async (payload: RegisterPayload) => {
      try {
        await register(payload);
        await signIn({ email: payload.email, password: payload.password });
      } catch (error: any) {
        // Re-throw with more context
        if (error instanceof Error) {
          throw error;
        }
        throw new Error(error?.message || 'Registration failed');
      }
    },
    [signIn],
  );

  const signOut = useCallback(async () => {
    setStatus('anonymous');
    setToken(null);
    setProfile(null);
    await persistToken(null);
  }, [persistToken]);

  const refreshProfile = useCallback(async () => {
    if (!token) return;
    const profileResponse = await getProfile(token);
    setProfile(profileResponse);
  }, [token]);

  const updateProfile = useCallback(
    async (payload: UpdateProfilePayload) => {
      if (!token) throw new Error('Unauthorized');
      const response = await updateProfileRequest(token, payload);
      setProfile(response);
    },
    [token],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      token,
      profile,
      authReady,
      signIn,
      signUp,
      signOut,
      refreshProfile,
      updateProfile,
    }),
    [authReady, profile, refreshProfile, signIn, signOut, signUp, status, token, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return ctx;
};

