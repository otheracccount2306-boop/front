import React from 'react';
import { StyleSheet, View } from 'react-native';
import colors from '../../theme/colors';
import { useLayout } from '../../theme/layout';

const ScreenContainer = ({ header, children, bodyStyle }) => {
  const layout = useLayout();
  const responsive = {
    maxWidth: layout.contentMaxWidth || '100%',
    paddingHorizontal: layout.bodyPadding,
  };
  return (
    <View style={styles.root}>
      {header}
      <View style={[styles.body, responsive, bodyStyle]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  body: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
  },
});

export default ScreenContainer;
