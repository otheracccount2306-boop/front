import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import colors from '../../theme/colors';
import { fontSizes, spacing } from '../../theme/typography';
import AppIcon from '../common/AppIcon';

const ShowOnMapLink = ({ onPress, label = 'Ver en mapa', style }) => (
  <Pressable
    onPress={onPress}
    hitSlop={8}
    accessibilityRole="button"
    accessibilityLabel={label}
    style={({ pressed }) => [styles.link, pressed && styles.pressed, style]}
  >
    <AppIcon name="map-outline" size={15} color={colors.primary} />
    <Text style={styles.text}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
  },
  pressed: {
    opacity: 0.6,
  },
  text: {
    color: colors.primary,
    fontSize: fontSizes.small,
    fontWeight: '700',
    marginLeft: spacing.xs,
  },
});

export default ShowOnMapLink;
