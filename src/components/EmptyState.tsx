import React from 'react';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useTheme } from '@/theme';

interface EmptyStateProps {
  icon?: React.ComponentProps<typeof Feather>['name'];
  title: string;
  subtitle?: string;
}

export const EmptyState = React.memo<EmptyStateProps>(({ icon = 'wind', title, subtitle }) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { borderColor: theme.colors.borderLight }]}>
      <LinearGradient
        colors={[theme.colors.glassLight, theme.colors.glass]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.glassOverlay}
      />
      <View style={[styles.iconWrapper, { backgroundColor: theme.colors.accent + '20' }]}>
        <Feather name={icon} size={32} color={theme.colors.accent} />
      </View>
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{title}</Text>
      {subtitle ? <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>{subtitle}</Text> : null}
    </View>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.title === nextProps.title &&
    prevProps.subtitle === nextProps.subtitle &&
    prevProps.icon === nextProps.icon
  );
});

EmptyState.displayName = 'EmptyState';

const styles = StyleSheet.create({
  container: {
    borderWidth: 1.5,
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    zIndex: 0,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.7,
  },
});

