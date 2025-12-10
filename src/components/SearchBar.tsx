import React, { useCallback } from 'react';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useTheme } from '@/theme';

interface SearchBarProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export const SearchBar = React.memo<SearchBarProps>(({ value, placeholder = 'Поиск по книгам', onChange }) => {
  const theme = useTheme();

  const handleChange = useCallback((text: string) => {
    onChange(text);
  }, [onChange]);

  return (
    <View style={[styles.container, { borderColor: theme.colors.borderLight }]}>
      <LinearGradient
        colors={[theme.colors.glassLight, theme.colors.glass]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.glassOverlay}
      />
      <View style={[styles.iconContainer, { backgroundColor: theme.colors.accent + '20' }]}>
        <Feather name="search" size={18} color={theme.colors.accent} />
      </View>
      <TextInput
        style={[styles.input, { color: theme.colors.textPrimary }]}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        value={value}
        onChangeText={handleChange}
        autoCorrect={false}
        autoCapitalize="none"
      />
    </View>
  );
});

SearchBar.displayName = 'SearchBar';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1.5,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    zIndex: 0,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    zIndex: 1,
  },
});

