import { colors } from './colors';
import { radii, spacing } from './spacing';

export const theme = {
  colors,
  spacing,
  radii,
  typography: {
    heading: 24,
    title: 20,
    body: 16,
    small: 14,
  },
  shadows: {
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.2,
      shadowRadius: 25,
      elevation: 12,
    },
  },
};

export type Theme = typeof theme;

export const useTheme = () => theme;

