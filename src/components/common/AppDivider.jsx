import React from 'react';
import { StyleSheet, View } from 'react-native';
import colors from '../../theme/colors';
import { spacing } from '../../theme/typography';

const AppDivider = () => <View style={styles.line} />;

const styles = StyleSheet.create({
  line: {
    height: 1,
    backgroundColor: colors.gray4,
    marginVertical: spacing.md,
  },
});

export default AppDivider;
