import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import colors from '../../theme/colors';
import { fontSizes, spacing } from '../../theme/typography';

const AdminSwitch = ({ label, value, onChange, hint }) => (
  <View style={styles.row}>
    <View style={styles.texts}>
      <Text style={styles.label}>{label}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
    <Switch
      value={value}
      onValueChange={onChange}
      accessibilityLabel={label}
      trackColor={{ false: colors.gray4, true: colors.light }}
      thumbColor={value ? colors.primary : colors.white}
    />
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  texts: {
    flex: 1,
    marginRight: spacing.md,
  },
  label: {
    fontSize: fontSizes.body,
    fontWeight: '600',
    color: colors.gray1,
  },
  hint: {
    fontSize: fontSizes.small,
    color: colors.gray3,
    marginTop: 2,
  },
});

export default AdminSwitch;
