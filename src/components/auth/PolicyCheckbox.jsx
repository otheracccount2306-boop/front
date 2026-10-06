import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import colors from '../../theme/colors';
import { fontSizes, spacing } from '../../theme/typography';
import AppIcon from '../common/AppIcon';

const PolicyCheckbox = ({ checked, onChange }) => (
  <Pressable
    onPress={() => onChange(!checked)}
    style={styles.row}
    accessibilityRole="checkbox"
    accessibilityState={{ checked }}
  >
    <View style={[styles.box, checked ? styles.boxChecked : null]}>
      {checked ? <AppIcon name="checkmark" size={16} color={colors.white} /> : null}
    </View>
    <Text style={styles.text}>
      Autorizo el tratamiento de mis datos personales por parte de la Universidad Cooperativa de Colombia,
      conforme a la Ley 1581 de 2012 y a su política de tratamiento de datos.
    </Text>
  </Pressable>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  box: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.gray3,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    marginTop: 1,
  },
  boxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  text: {
    flex: 1,
    fontSize: fontSizes.small,
    color: colors.gray2,
    lineHeight: 18,
  },
});

export default PolicyCheckbox;
