import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Alert, Dimensions, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

import { PrimaryButton } from '@/components/PrimaryButton';
import type { RootStackParamList } from '@/navigation/types';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/theme';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LeafSideApiError } from '@/services/apiClient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isSmallDevice = SCREEN_WIDTH < 375;
const isTablet = SCREEN_WIDTH >= 768;

export const LoginScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { signIn } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

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
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Header Icon */}
            <View style={[styles.headerIcon, { backgroundColor: theme.colors.accentGlow }]}>
              <Feather name="log-in" size={isSmallDevice ? 28 : isTablet ? 40 : 32} color={theme.colors.accent} />
            </View>

            <Text style={[styles.heading, { color: theme.colors.textPrimary }]}>
              Welcome Back
            </Text>
            <Text style={[styles.subheading, { color: theme.colors.textSecondary }]}>
              Sign in to continue
            </Text>
            
            {/* Email Field */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                Email
              </Text>
              <View style={[styles.inputWrapper, { borderColor: theme.colors.borderLight }]}>
                <Feather name="mail" size={20} color={theme.colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: theme.colors.textPrimary }]}
                  value={form.email}
                  onChangeText={(value) => setForm((prev) => ({ ...prev, email: value }))}
                  placeholder="Enter your email"
                  placeholderTextColor={theme.colors.textMuted}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                Password
              </Text>
              <View style={[styles.inputWrapper, { borderColor: theme.colors.borderLight }]}>
                <Feather name="lock" size={20} color={theme.colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: theme.colors.textPrimary }]}
                  value={form.password}
                  onChangeText={(value) => setForm((prev) => ({ ...prev, password: value }))}
                  placeholder="Enter your password"
                  placeholderTextColor={theme.colors.textMuted}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>
            </View>

            <PrimaryButton 
              label="Sign In" 
              onPress={submit} 
              loading={loading} 
              disabled={!form.email || !form.password}
              icon={<Feather name="arrow-right" size={18} color="#0d1b2a" />}
            />
            
            <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
              Don't have an account?{' '}
              <Text 
                style={{ color: theme.colors.accent, fontWeight: '700' }} 
                onPress={() => navigation.navigate('Register')}
              >
                Sign Up
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    padding: isTablet ? 40 : isSmallDevice ? 16 : 20,
    paddingHorizontal: isTablet ? Math.min(SCREEN_WIDTH * 0.2, 200) : (isSmallDevice ? 16 : 20),
    gap: isSmallDevice ? 14 : 16,
    zIndex: 1,
  },
  headerIcon: {
    width: isSmallDevice ? 64 : isTablet ? 96 : 80,
    height: isSmallDevice ? 64 : isTablet ? 96 : 80,
    borderRadius: isSmallDevice ? 32 : isTablet ? 48 : 40,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    shadowColor: '#34d399',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: isSmallDevice ? 12 : 16,
  },
  heading: { 
    fontSize: isSmallDevice ? 28 : isTablet ? 40 : 32,
    fontWeight: '900',
    marginBottom: 4,
    letterSpacing: -0.8,
    textAlign: 'center',
  },
  subheading: {
    fontSize: isSmallDevice ? 14 : isTablet ? 18 : 16,
    textAlign: 'center',
    marginBottom: isSmallDevice ? 16 : 20,
  },
  fieldContainer: {
    gap: isSmallDevice ? 6 : 8,
  },
  label: { 
    fontSize: isSmallDevice ? 13 : isTablet ? 15 : 14,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: isTablet ? 16 : 14,
    paddingHorizontal: isSmallDevice ? 12 : 14,
    height: isSmallDevice ? 48 : isTablet ? 56 : 52,
  },
  inputIcon: {
    marginRight: isSmallDevice ? 8 : 10,
  },
  input: { 
    flex: 1,
    fontSize: isSmallDevice ? 15 : isTablet ? 17 : 16,
    fontWeight: '500',
  },
  footerText: {
    textAlign: 'center',
    fontSize: isSmallDevice ? 13 : isTablet ? 16 : 14,
    marginTop: 8,
  },
});
