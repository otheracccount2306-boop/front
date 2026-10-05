import React from 'react';
import { StyleSheet, View } from 'react-native';
import colors from '../../theme/colors';
import { cardShadow, radius, spacing } from '../../theme/typography';

/**
 * @description Tarjeta con fondo blanco, borde redondeado y sombra leve.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido de la tarjeta
 * @param {Object} [props.style] - Estilos adicionales
 * @returns {React.JSX.Element} Tarjeta
 */
const AppCard = ({ children, style }) => <View style={[styles.card, style]}>{children}</View>;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.card,
    padding: spacing.lg,
    ...cardShadow,
  },
});

export default AppCard;
