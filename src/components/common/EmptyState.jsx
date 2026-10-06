import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '../../theme/colors';
import { fontSizes, spacing } from '../../theme/typography';
import AppIcon from './AppIcon';

const EmptyState = ({ message, icon = 'file-tray-outline' }) => (
  <View style={styles.container}>
    <AppIcon name={icon} size={48} color={colors.gray3} />
    <Text style={styles.message}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    minHeight: 180,
  },
  message: {
    marginTop: spacing.md,
    fontSize: fontSizes.body,
    color: colors.gray2,
    textAlign: 'center',
  },
});

export default EmptyState;
