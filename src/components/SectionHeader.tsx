import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
}

export const SectionHeader = ({ title, actionLabel, onActionPress }: SectionHeaderProps) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{title}</Text>
      {actionLabel && onActionPress ? (
        <Pressable style={styles.action} onPress={onActionPress}>
          <Text style={[styles.actionLabel, { color: theme.colors.accent }]}>{actionLabel}</Text>
          <Feather name="arrow-right" size={16} color={theme.colors.accent} />
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});

