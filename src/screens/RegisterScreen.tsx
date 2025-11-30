import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import type { RootStackParamList } from '@/navigation/types';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/theme';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const FIELDS = [
  { key: 'firstName', label: 'Имя', secure: false },
  { key: 'lastName', label: 'Фамилия', secure: false },
  { key: 'email', label: 'Email', secure: false },
  { key: 'phoneNumber', label: 'Телефон', secure: false },
  { key: 'password', label: 'Пароль', secure: true },
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
      Alert.alert('Ошибка регистрации', (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.heading, { color: theme.colors.textPrimary }]}>Регистрация</Text>
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
      <PrimaryButton label="Создать аккаунт" onPress={submit} loading={loading} />
      <Text style={{ color: theme.colors.textSecondary, textAlign: 'center' }}>
        Уже есть аккаунт?{' '}
        <Text style={{ color: theme.colors.accent }} onPress={() => navigation.navigate('Login')}>
          Войти
        </Text>
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, gap: 16 },
  heading: { fontSize: 28, fontWeight: '700', textAlign: 'center', marginBottom: 12 },
  label: { marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 14, padding: 12 },
});

