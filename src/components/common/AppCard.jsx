import React from 'react';
import { StyleSheet, View } from 'react-native';
import colors from '../../theme/colors';
import { cardShadow, radius, spacing } from '../../theme/typography';

const AppCard = ({ children, style }) => <View style={[styles.card, style]}>{children}</View>;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.card,
    padding: spacing.lg,
    ...cardShadow,
  },
});

export default AppCard;
