import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import colors from '../../theme/colors';
import { spacing } from '../../theme/typography';

/**
 * @description Indicador de carga centrado con el color primario UCC.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Object} props - Propiedades del componente
 * @param {'small'|'large'} [props.size] - Tamaño del indicador, large por defecto
 * @param {string} [props.color] - Color del indicador, primary por defecto
 * @param {boolean} [props.fill] - Si es true ocupa todo el espacio disponible
 * @returns {React.JSX.Element} Indicador de carga
 */
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
