import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '../../theme/colors';
import { fontSizes, radius, spacing } from '../../theme/typography';

const VARIANTS = {
  success: { background: colors.pale, text: colors.primary },
  warning: { background: colors.accentLight, text: colors.gray1 },
  neutral: { background: colors.gray4, text: colors.gray2 },
};

const AppBadge = ({ label, variant = 'neutral' }) => {
  const palette = VARIANTS[variant] || VARIANTS.neutral;
  return (
    <View style={[styles.badge, { backgroundColor: palette.background }]}>
      <Text style={[styles.label, { color: palette.text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radius.chip,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  label: {
    fontSize: fontSizes.label,
    fontWeight: '700',
  },
});

export default AppBadge;
