import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import type { RootStackParamList } from '@/navigation/types';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/theme';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const FIELDS = [
  { key: 'firstName', label: 'First Name', secure: false },
  { key: 'lastName', label: 'Last Name', secure: false },
  { key: 'email', label: 'Email', secure: false },
  { key: 'phoneNumber', label: 'Phone', secure: false },
  { key: 'password', label: 'Password', secure: true },
] as const;

export const RegisterScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { signUp } = useAuth();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    try {
      setLoading(true);
      await signUp(form);
      navigation.navigate('Tabs');
    } catch (error) {
      Alert.alert('Registration Error', (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.heading, { color: theme.colors.textPrimary }]}>Sign Up</Text>
      {FIELDS.map((field) => (
        <View key={field.key}>
          <Text style={[styles.label, { color: theme.colors.textMuted }]}>{field.label}</Text>
          <TextInput
            style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.textPrimary }]}
            value={form[field.key]}
            onChangeText={(value) => setForm((prev) => ({ ...prev, [field.key]: value }))}
            secureTextEntry={field.secure}
            placeholderTextColor={theme.colors.textMuted}
            autoCapitalize={field.key === 'email' || field.key === 'phoneNumber' ? 'none' : 'words'}
            keyboardType={
              field.key === 'phoneNumber' ? 'phone-pad' : field.key === 'email' ? 'email-address' : 'default'
            }
          />
        </View>
      ))}
      <PrimaryButton label="Create Account" onPress={submit} loading={loading} />
      <Text style={{ color: theme.colors.textSecondary, textAlign: 'center' }}>
        Already have an account?{' '}
        <Text style={{ color: theme.colors.accent }} onPress={() => navigation.navigate('Login')}>
          Sign In
        </Text>
      </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, gap: 16 },
  heading: { fontSize: 28, fontWeight: '700', textAlign: 'center', marginBottom: 12 },
  label: { marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 14, padding: 12 },
});

