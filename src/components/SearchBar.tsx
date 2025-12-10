import React, { useCallback, useRef, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, TextInput, View, Animated, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useTheme } from '@/theme';

interface SearchBarProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export const SearchBar = React.memo<SearchBarProps>(({ value, placeholder = 'Поиск по книгам', onChange }) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const inputRef = useRef<TextInput>(null);

  const handleChange = useCallback((text: string) => {
    onChange(text);
  }, [onChange]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    Animated.spring(scaleAnim, {
      toValue: 1.02,
      useNativeDriver: true,
      speed: 20,
      bounciness: 8,
    }).start();
  }, [scaleAnim]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 8,
    }).start();
  }, [scaleAnim]);

  const handleClear = useCallback(() => {
    onChange('');
    inputRef.current?.focus();
  }, [onChange]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          borderColor: isFocused ? theme.colors.accent : theme.colors.borderLight,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <LinearGradient
        colors={isFocused 
          ? [theme.colors.glassMedium, theme.colors.glassLight] 
          : [theme.colors.glassLight, theme.colors.glass]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.glassOverlay}
      />
      
      <View style={[
        styles.iconContainer, 
        { 
          backgroundColor: isFocused 
            ? theme.colors.accentGlowStrong 
            : theme.colors.accentGlow 
        }
      ]}>
        <Feather 
          name="search" 
          size={20} 
          color={isFocused ? theme.colors.accentLight : theme.colors.accent} 
        />
      </View>
      
      <TextInput
        ref={inputRef}
        style={[styles.input, { color: theme.colors.textPrimary }]}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        value={value}
        onChangeText={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
      />
      
      {value.length > 0 && (
        <Pressable
          onPress={handleClear}
          style={({ pressed }) => [
            styles.clearButton,
            {
              backgroundColor: theme.colors.glassLight,
              opacity: pressed ? 0.5 : 1,
            },
          ]}
        >
          <Feather name="x" size={18} color={theme.colors.textMuted} />
        </Pressable>
      )}
    </Animated.View>
  );
});

SearchBar.displayName = 'SearchBar';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 2,
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
    borderRadius: 18,
    zIndex: 0,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    zIndex: 1,
    fontWeight: '500',
  },
  clearButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
});
