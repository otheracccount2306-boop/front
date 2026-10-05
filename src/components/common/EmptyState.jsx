import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '../../theme/colors';
import { fontSizes, spacing } from '../../theme/typography';
import AppIcon from './AppIcon';

/**
 * @description Estado vacío centrado con un ícono y un mensaje.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Object} props - Propiedades del componente
 * @param {string} props.message - Mensaje a mostrar
 * @param {string} [props.icon] - Nombre del ícono de Ionicons, "file-tray-outline" por defecto
 * @returns {React.JSX.Element} Estado vacío
 */
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
