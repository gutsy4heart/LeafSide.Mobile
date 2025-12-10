import React, { useCallback, useMemo, useRef } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useTheme } from '@/theme';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass';
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const PrimaryButton = React.memo<PrimaryButtonProps>(({
  label,
  onPress,
  disabled,
  loading,
  variant = 'primary',
  icon,
  fullWidth = true,
}) => {
  const theme = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Removed pulsing glow - causes animation conflicts

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [scaleAnim]);

  const handlePress = useCallback(() => {
    if (!disabled && !loading) {
      onPress();
    }
  }, [onPress, disabled, loading]);

  const buttonStyle = useMemo(() => {
    const baseStyle: any = {
      borderRadius: 14,
      borderWidth: variant === 'ghost' || variant === 'glass' ? 1.5 : 0,
      borderColor: variant === 'ghost' || variant === 'glass' ? theme.colors.borderLight : 'transparent',
      overflow: 'hidden',
      backgroundColor: 'transparent',
    };
    
    if (fullWidth) {
      baseStyle.width = '100%';
    }
    
    return baseStyle;
  }, [theme, variant, fullWidth]);

  const labelStyle = useMemo(() => ({
    color: variant === 'primary' ? '#0d1b2a' : theme.colors.textPrimary,
    fontWeight: '700' as const,
    fontSize: 16,
    letterSpacing: 0.5,
    zIndex: 1,
    position: 'relative' as const,
  }), [variant, theme]);

  return (
    <Animated.View
      style={[
        buttonStyle,
        {
          transform: [{ scale: scaleAnim }],
          opacity: disabled || loading ? 0.5 : 1,
        },
        variant === 'primary' && {
          shadowColor: theme.colors.accent,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.4,
          shadowRadius: 20,
          elevation: 10,
        },
      ]}
    >
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}
      >
        {variant === 'primary' ? (
          <LinearGradient
            colors={[theme.colors.accentLight, theme.colors.accent, theme.colors.accentMuted]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        ) : variant === 'secondary' ? (
          <LinearGradient
            colors={[theme.colors.glassMedium, theme.colors.glassLight, theme.colors.glass]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        ) : variant === 'glass' ? (
          <View style={StyleSheet.absoluteFill}>
            <LinearGradient
              colors={[theme.colors.glassLight, theme.colors.glass]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </View>
        ) : null}
        
        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator color={variant === 'primary' ? '#0d1b2a' : theme.colors.textPrimary} />
          ) : (
            <View style={styles.labelContainer}>
              {icon && <View style={styles.icon}>{icon}</View>}
              <Text style={labelStyle}>{label}</Text>
            </View>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.label === nextProps.label &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.loading === nextProps.loading &&
    prevProps.variant === nextProps.variant &&
    prevProps.fullWidth === nextProps.fullWidth
  );
});

PrimaryButton.displayName = 'PrimaryButton';

const styles = StyleSheet.create({
  content: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    position: 'relative',
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
  },
  icon: {
    marginRight: 0,
  },
});

