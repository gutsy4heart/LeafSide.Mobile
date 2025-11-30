import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import type { RootStackParamList } from '@/navigation/types';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/theme';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export const LoginScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { signIn } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    try {
      setLoading(true);
      await signIn(form);
      navigation.navigate('Tabs');
    } catch (error) {
      Alert.alert('Ошибка входа', (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.heading, { color: theme.colors.textPrimary }]}>Вход</Text>
      {(['email', 'password'] as const).map((field) => (
        <View key={field}>
          <Text style={[styles.label, { color: theme.colors.textMuted }]}>{field}</Text>
          <TextInput
            style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.textPrimary }]}
            value={form[field]}
            onChangeText={(value) => setForm((prev) => ({ ...prev, [field]: value }))}
            placeholderTextColor={theme.colors.textMuted}
            secureTextEntry={field === 'password'}
            autoCapitalize="none"
            keyboardType={field === 'email' ? 'email-address' : 'default'}
          />
        </View>
      ))}
      <PrimaryButton label="Войти" onPress={submit} loading={loading} disabled={!form.email || !form.password} />
      <Text style={{ color: theme.colors.textSecondary, textAlign: 'center' }}>
        Нет аккаунта?{' '}
        <Text style={{ color: theme.colors.accent }} onPress={() => navigation.navigate('Register')}>
          Зарегистрироваться
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 16, justifyContent: 'center' },
  heading: { fontSize: 28, fontWeight: '700' },
  label: { marginBottom: 6, textTransform: 'capitalize' },
  input: { borderWidth: 1, borderRadius: 14, padding: 12 },
});

