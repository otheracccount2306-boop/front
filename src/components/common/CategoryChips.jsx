import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import colors from '../../theme/colors';
import { fontSizes, radius, spacing } from '../../theme/typography';

const CategoryChips = ({ chips, selected, onSelect }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={styles.scroll}
    contentContainerStyle={styles.content}
  >
    {chips.map((chip) => {
      const active = chip.value === selected;
      return (
        <Pressable
          key={chip.value}
          onPress={() => onSelect(chip.value)}
          style={[styles.chip, active ? styles.chipActive : null]}
          accessibilityRole="button"
          accessibilityState={{ selected: active }}
        >
          <Text style={[styles.label, active ? styles.labelActive : null]}>{chip.label}</Text>
        </Pressable>
      );
    })}
  </ScrollView>
);

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
    flexShrink: 0,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  chip: {
    backgroundColor: colors.gray4,
    borderRadius: radius.chip,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
  },
  chipActive: {
    backgroundColor: colors.primary,
  },
  label: {
    fontSize: fontSizes.small,
    fontWeight: '600',
    color: colors.gray2,
  },
  labelActive: {
    color: colors.white,
  },
});

export default CategoryChips;
