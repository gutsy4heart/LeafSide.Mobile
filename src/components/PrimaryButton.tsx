import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { useTheme } from '@/theme';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export const PrimaryButton = ({
  label,
  onPress,
  disabled,
  loading,
  variant = 'primary',
}: PrimaryButtonProps) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    button: {
      paddingVertical: 14,
      borderRadius: theme.radii.lg,
      alignItems: 'center',
      backgroundColor:
        variant === 'primary'
          ? theme.colors.accent
          : variant === 'secondary'
            ? theme.colors.cardAlt
            : 'transparent',
      borderWidth: variant === 'ghost' ? 1 : 0,
      borderColor: theme.colors.border,
      opacity: disabled ? 0.6 : 1,
    },
    label: {
      color: variant === 'primary' ? '#062016' : theme.colors.textPrimary,
      fontWeight: '600',
      fontSize: 16,
    },
  });

  return (
    <Pressable style={styles.button} onPress={onPress} disabled={disabled || loading}>
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#062016' : theme.colors.textPrimary} />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </Pressable>
  );
};

