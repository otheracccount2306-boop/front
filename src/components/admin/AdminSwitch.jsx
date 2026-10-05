import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import colors from '../../theme/colors';
import { fontSizes, spacing } from '../../theme/typography';

/**
 * @description Interruptor con etiqueta para valores verdadero o falso en formularios, por ejemplo
 *              si un servicio está activo.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Object} props - Propiedades del componente
 * @param {string} props.label - Etiqueta del interruptor
 * @param {boolean} props.value - Estado actual
 * @param {Function} props.onChange - Recibe el nuevo estado
 * @param {string} [props.hint] - Texto de ayuda bajo la etiqueta
 * @returns {React.JSX.Element} Interruptor con etiqueta
 */
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
