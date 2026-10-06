import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import { cardShadow, spacing } from '../../theme/typography';
import AppIcon from '../common/AppIcon';

const AdminFab = ({ onPress, label }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [styles.fab, { opacity: pressed ? 0.85 : 1 }]}
    accessibilityRole="button"
    accessibilityLabel={label}
  >
    <AppIcon name="add" size={30} color={colors.white} />
  </Pressable>
);

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...cardShadow,
  },
});

export default AdminFab;
