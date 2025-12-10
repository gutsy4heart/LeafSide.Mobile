import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { PrimaryButton } from '@/components/PrimaryButton';
import type { RootStackParamList } from '@/navigation/types';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/theme';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LeafSideApiError } from '@/services/apiClient';

export const LoginScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { signIn } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const useTestCredentials = () => {
    setForm({
      email: 'admin@leafside.local',
      password: 'Admin12345!',
    });
  };

  const submit = async () => {
    try {
      setLoading(true);
      console.log('[LoginScreen] Attempting login with:', form.email);
      await signIn(form);
      navigation.navigate('Tabs');
    } catch (error) {
      let errorMessage = 'Unknown error';
      
      if (error instanceof LeafSideApiError) {
        if (error.status === 401) {
          errorMessage = 'Invalid email or password.\n\nPlease check your credentials or sign up.';
        } else if (error.status === 0) {
          errorMessage = 'Cannot connect to server.\n\nPlease check your internet connection.';
        } else {
          errorMessage = `Server error (${error.status})`;
        }
      } else {
        errorMessage = (error as Error).message;
      }
      
      Alert.alert('Login Error', errorMessage);
      console.error('[LoginScreen] Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <LinearGradient
        colors={[theme.colors.backgroundGradientStart, theme.colors.backgroundGradientEnd]}
        style={StyleSheet.absoluteFill}
      />
      
      <View style={styles.content}>
        <Text style={[styles.heading, { color: theme.colors.textPrimary }]}>Sign In</Text>
        
        {/* Test credentials hint */}
        <Pressable 
          style={[styles.testHint, { backgroundColor: theme.colors.glassMedium, borderColor: theme.colors.borderLight }]}
          onPress={useTestCredentials}
        >
          <Text style={[styles.testHintText, { color: theme.colors.accentLight }]}>
            💡 Tap to autofill test credentials
          </Text>
        </Pressable>
        
        {(['email', 'password'] as const).map((field) => (
          <View key={field}>
            <Text style={[styles.label, { color: theme.colors.textMuted }]}>
              {field === 'email' ? 'Email' : 'Password'}
            </Text>
            <TextInput
              style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.textPrimary, backgroundColor: theme.colors.glass }]}
              value={form[field]}
              onChangeText={(value) => setForm((prev) => ({ ...prev, [field]: value }))}
              placeholder={field === 'email' ? 'murad.nurmammadli@gmail.com' : 'Qwerty123!'}
              placeholderTextColor={theme.colors.textMuted}
              secureTextEntry={field === 'password'}
              autoCapitalize="none"
              keyboardType={field === 'email' ? 'email-address' : 'default'}
            />
          </View>
        ))}
        <PrimaryButton label="Sign In" onPress={submit} loading={loading} disabled={!form.email || !form.password} />
        <Text style={{ color: theme.colors.textSecondary, textAlign: 'center' }}>
          Don't have an account?{' '}
          <Text style={{ color: theme.colors.accent }} onPress={() => navigation.navigate('Register')}>
            Sign Up
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    gap: 16,
    justifyContent: 'center',
    zIndex: 1,
  },
  heading: { 
    fontSize: 32, 
    fontWeight: '900',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  testHint: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    marginBottom: 8,
  },
  testHintText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  label: { 
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  input: { 
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 14,
    fontSize: 16,
  },
});

