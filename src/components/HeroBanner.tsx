import React, { useCallback } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme';
import { PrimaryButton } from './PrimaryButton';

interface HeroBannerProps {
  headline: string;
  subheading: string;
  ctaLabel: string;
  onCtaPress: () => void;
}

export const HeroBanner = React.memo<HeroBannerProps>(({ headline, subheading, ctaLabel, onCtaPress }) => {
  const theme = useTheme();

  const handlePress = useCallback(() => {
    onCtaPress();
  }, [onCtaPress]);

  return (
    <LinearGradient
      colors={['rgba(27, 42, 65, 0.7)', 'rgba(15, 26, 46, 0.6)', 'rgba(10, 18, 32, 0.5)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.wrapper}
    >
      <LinearGradient
        colors={[theme.colors.glassLight, theme.colors.glass]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.glassOverlay}
      />
      <View style={styles.overlay}>
        <View style={styles.textContainer}>
          <Text style={[styles.headline, { color: theme.colors.textPrimary }]}>{headline}</Text>
          <Text style={[styles.subheading, { color: theme.colors.textMuted }]}>{subheading}</Text>
        </View>
        <PrimaryButton label={ctaLabel} onPress={handlePress} />
      </View>
    </LinearGradient>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.headline === nextProps.headline &&
    prevProps.subheading === nextProps.subheading &&
    prevProps.ctaLabel === nextProps.ctaLabel
  );
});

HeroBanner.displayName = 'HeroBanner';

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 28,
    padding: 24,
    marginBottom: 4,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 15,
    overflow: 'hidden',
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 28,
    zIndex: 0,
  },
  overlay: {
    gap: 20,
    position: 'relative',
    zIndex: 1,
  },
  textContainer: {
    gap: 8,
  },
  headline: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  subheading: {
    fontSize: 16,
    lineHeight: 22,
    opacity: 0.85,
  },
});

