import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useTheme } from '@/theme';

interface FilterChipProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
}

export const FilterChip = React.memo<FilterChipProps>(({ label, selected, onPress }) => {
  const theme = useTheme();

  const handlePress = useCallback(() => {
    onPress();
  }, [onPress]);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.chip,
        {
          borderColor: selected ? theme.colors.accent : theme.colors.borderLight,
          opacity: pressed ? 0.8 : 1,
          transform: [{ scale: pressed ? 0.95 : 1 }],
        },
      ]}
      onPress={handlePress}
    >
      {selected ? (
        <LinearGradient
          colors={[theme.colors.accent, theme.colors.accentMuted]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <Text style={[styles.label, { color: '#062016' }]}>{label}</Text>
        </LinearGradient>
      ) : (
        <>
          <LinearGradient
            colors={[theme.colors.glassLight, theme.colors.glass]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          />
          <Text style={[styles.label, { color: theme.colors.textPrimary }]}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}, (prevProps, nextProps) => {
  return prevProps.selected === nextProps.selected && prevProps.label === nextProps.label;
});

FilterChip.displayName = 'FilterChip';

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1.5,
    marginRight: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 999,
    zIndex: 0,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.2,
    zIndex: 1,
    position: 'relative',
  },
});

