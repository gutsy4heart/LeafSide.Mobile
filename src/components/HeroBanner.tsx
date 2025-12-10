import React, { useCallback } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

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
    <View style={styles.container}>
      {/* Static glow effect */}
      <View
        style={[
          styles.glowEffect,
          {
            opacity: 0.3,
            backgroundColor: theme.colors.accent,
          },
        ]}
      />
      
      {/* Decorative element */}
      <View
        style={[
          styles.decorativeCircle,
          {
            backgroundColor: theme.colors.accentGlow,
          },
        ]}
      >
        <View style={[styles.decorativeInner, { backgroundColor: theme.colors.accentGlowStrong }]} />
      </View>

      <LinearGradient
        colors={[
          theme.colors.card,
          theme.colors.cardAlt,
          theme.colors.glass,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.wrapper}
      >
        <LinearGradient
          colors={[theme.colors.glassMedium, theme.colors.glassLight, theme.colors.glass]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.glassOverlay}
        />
        
        {/* Accent corner decoration */}
        <View style={[styles.cornerDecoration, { backgroundColor: theme.colors.accentGlow }]}>
          <Feather name="zap" size={24} color={theme.colors.accent} />
        </View>

        <View style={styles.overlay}>
          <View style={styles.textContainer}>
            <View style={styles.headlineContainer}>
              <Text style={[styles.headline, { color: theme.colors.textPrimary }]}>
                {headline}
              </Text>
              <LinearGradient
                colors={[theme.colors.accent, 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.headlineUnderline}
              />
            </View>
            <Text style={[styles.subheading, { color: theme.colors.textSecondary }]}>
              {subheading}
            </Text>
          </View>
          
          <PrimaryButton 
            label={ctaLabel} 
            onPress={handlePress}
            fullWidth={false}
            icon={<Feather name="arrow-right" size={18} color="#0d1b2a" />}
          />
        </View>
      </LinearGradient>
    </View>
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
  container: {
    position: 'relative',
    marginBottom: 4,
  },
  glowEffect: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 200,
    height: 200,
    marginLeft: -100,
    marginTop: -100,
    borderRadius: 100,
    zIndex: 0,
    shadowColor: '#34d399',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 60,
    elevation: 0,
  },
  decorativeCircle: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 120,
    height: 120,
    borderRadius: 60,
    zIndex: 1,
    opacity: 0.3,
  },
  decorativeInner: {
    position: 'absolute',
    top: 30,
    left: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  wrapper: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
    overflow: 'hidden',
    position: 'relative',
    zIndex: 2,
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    zIndex: 0,
  },
  cornerDecoration: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    shadowColor: '#34d399',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  overlay: {
    gap: 16,
    position: 'relative',
    zIndex: 1,
  },
  textContainer: {
    gap: 8,
  },
  headlineContainer: {
    position: 'relative',
  },
  headline: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.6,
    lineHeight: 32,
    marginBottom: 6,
  },
  headlineUnderline: {
    height: 3,
    width: 60,
    borderRadius: 2,
    marginTop: 3,
  },
  subheading: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.9,
    fontWeight: '500',
  },
});
