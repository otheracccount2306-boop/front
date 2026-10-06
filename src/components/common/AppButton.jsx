import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import colors from '../../theme/colors';
import { fontSizes, radius, spacing } from '../../theme/typography';
import AppLoader from './AppLoader';

const VARIANTS = {
  primary: { background: colors.primary, border: colors.primary, text: colors.white },
  outline: { background: colors.white, border: colors.primary, text: colors.primary },
  danger: { background: colors.error, border: colors.error, text: colors.white },
};

const AppButton = ({ label, onPress, variant = 'primary', disabled = false, loading = false, style }) => {
  const palette = VARIANTS[variant] || VARIANTS.primary;
  const blocked = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: blocked }}
      disabled={blocked}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: palette.background, borderColor: palette.border },
        { opacity: blocked ? 0.5 : pressed ? 0.85 : 1 },
        style,
      ]}
    >
      {loading ? (
        <AppLoader size="small" color={palette.text} />
      ) : (
        <Text style={[styles.label, { color: palette.text }]}>{label}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    minHeight: 46,
    borderRadius: radius.input,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: fontSizes.body,
    fontWeight: '700',
  },
});

export default AppButton;
