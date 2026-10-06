import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import colors from '../../theme/colors';
import { spacing } from '../../theme/typography';

const AppLoader = ({ size = 'large', color = colors.primary, fill = false }) => (
  <View style={fill ? styles.fill : styles.inline}>
    <ActivityIndicator size={size} color={color} />
  </View>
);

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inline: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
  },
});

export default AppLoader;
