import { Pressable, StyleSheet, Text } from 'react-native';

import { useTheme } from '@/theme';

interface FilterChipProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
}

export const FilterChip = ({ label, selected, onPress }: FilterChipProps) => {
  const theme = useTheme();

  return (
    <Pressable
      style={[
        styles.chip,
        {
          backgroundColor: selected ? theme.colors.accent : theme.colors.cardAlt,
          borderColor: selected ? theme.colors.accent : theme.colors.border,
        },
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.label,
          { color: selected ? '#062016' : theme.colors.textPrimary },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
});

