import React, { useCallback, useMemo } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useTheme } from '@/theme';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export const PrimaryButton = React.memo<PrimaryButtonProps>(({
  label,
  onPress,
  disabled,
  loading,
  variant = 'primary',
}) => {
  const theme = useTheme();

  const handlePress = useCallback(() => {
    if (!disabled && !loading) {
      onPress();
    }
  }, [onPress, disabled, loading]);

  const buttonBaseStyle = useMemo(() => ({
    paddingVertical: 16,
    borderRadius: theme.radii.lg,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderWidth: variant === 'ghost' ? 1.5 : 0,
    borderColor: variant === 'ghost' ? theme.colors.borderLight : 'transparent',
    shadowColor: variant === 'primary' ? theme.colors.accent : '#000',
    shadowOffset: { width: 0, height: variant === 'primary' ? 6 : 2 },
    shadowOpacity: variant === 'primary' ? 0.5 : 0.1,
    shadowRadius: variant === 'primary' ? 12 : 4,
    elevation: variant === 'primary' ? 8 : 2,
    overflow: 'hidden' as const,
    backgroundColor: 'transparent',
  }), [theme, variant]);

  const labelStyle = useMemo(() => ({
    color: variant === 'primary' ? '#062016' : theme.colors.textPrimary,
    fontWeight: '700' as const,
    fontSize: 16,
    letterSpacing: 0.3,
    zIndex: 1,
    position: 'relative' as const,
  }), [variant, theme]);

  return (
    <Pressable
      style={({ pressed }) => [
        buttonBaseStyle,
        {
          opacity: disabled || loading ? 0.5 : pressed ? 0.9 : 1,
          transform: [{ scale: pressed && !disabled && !loading ? 0.98 : 1 }],
        },
      ]}
      onPress={handlePress}
      disabled={disabled || loading}
    >
      {variant === 'primary' ? (
        <LinearGradient
          colors={[theme.colors.accent, theme.colors.accentMuted]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      ) : variant === 'secondary' ? (
        <LinearGradient
          colors={[theme.colors.glassLight, theme.colors.glass]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={variant === 'primary' ? '#062016' : theme.colors.textPrimary} />
        ) : (
          <Text style={labelStyle}>{label}</Text>
        )}
      </View>
    </Pressable>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.label === nextProps.label &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.loading === nextProps.loading &&
    prevProps.variant === nextProps.variant
  );
});

PrimaryButton.displayName = 'PrimaryButton';

const styles = StyleSheet.create({
  content: {
    position: 'relative',
    zIndex: 1,
  },
});

