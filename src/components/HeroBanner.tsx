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

export const HeroBanner = ({ headline, subheading, ctaLabel, onCtaPress }: HeroBannerProps) => {
  const theme = useTheme();

  return (
    <LinearGradient
      colors={['#1b2a41', '#102035']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.wrapper}
    >
      <View style={styles.overlay}>
        <Text style={[styles.headline, { color: theme.colors.textPrimary }]}>{headline}</Text>
        <Text style={[styles.subheading, { color: theme.colors.textMuted }]}>{subheading}</Text>
        <PrimaryButton label={ctaLabel} onPress={onCtaPress} />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 24,
    padding: 20,
  },
  overlay: {
    gap: 12,
  },
  headline: {
    fontSize: 24,
    fontWeight: '700',
  },
  subheading: {
    fontSize: 15,
    lineHeight: 20,
  },
});

