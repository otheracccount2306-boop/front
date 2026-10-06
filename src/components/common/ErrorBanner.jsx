import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import colors from '../../theme/colors';
import { fontSizes, radius, spacing } from '../../theme/typography';

const VARIANTS = {
  error: { background: colors.errorLight, border: colors.error, text: colors.error },
  success: { background: colors.pale, border: colors.success, text: colors.primary },
  info: { background: colors.accentLight, border: colors.accent, text: colors.gray1 },
};

const ErrorBanner = ({ message, variant = 'error', onRetry }) => {
  if (!message) {
    return null;
  }
  const palette = VARIANTS[variant] || VARIANTS.error;
  return (
    <View style={[styles.banner, { backgroundColor: palette.background, borderLeftColor: palette.border }]}>
      <Text style={[styles.message, { color: palette.text }]}>{message}</Text>
      {onRetry ? (
        <Pressable onPress={onRetry} accessibilityRole="button">
          <Text style={[styles.retry, { color: palette.text }]}>Reintentar</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    borderLeftWidth: 4,
    borderRadius: radius.card,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  message: {
    fontSize: fontSizes.body,
  },
  retry: {
    fontSize: fontSizes.body,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
});

export default ErrorBanner;
