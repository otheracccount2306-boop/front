import React from 'react';
import { StyleSheet, View } from 'react-native';
import colors from '../../theme/colors';

const ScreenContainer = ({ header, children, bodyStyle }) => (
  <View style={styles.root}>
    {header}
    <View style={[styles.body, bodyStyle]}>{children}</View>
  </View>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  body: {
    flex: 1,
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
  },
});

export default ScreenContainer;
