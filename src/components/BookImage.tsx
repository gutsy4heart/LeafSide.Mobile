import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { useTheme } from '@/theme';

interface BookImageProps {
  imageUrl?: string;
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
}

export const BookImage = ({ imageUrl, width = '100%', height = 200, borderRadius = 0 }: BookImageProps) => {
  const theme = useTheme();
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const hasImage = imageUrl && imageUrl.trim() !== '';

  if (!hasImage || hasError) {
    return (
      <View style={[styles.placeholder, { width, height, borderRadius, backgroundColor: theme.colors.cardAlt }]}>
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.accent + '15' }]}>
          <Feather name="book-open" size={28} color={theme.colors.accent} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { width, height, borderRadius, overflow: 'hidden' }]}>
      {isLoading && (
        <View style={[styles.loadingOverlay, { backgroundColor: theme.colors.cardAlt }]}>
          <Feather name="book" size={24} color={theme.colors.textMuted} />
        </View>
      )}
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="cover"
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
});

