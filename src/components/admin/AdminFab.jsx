import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import { cardShadow, spacing } from '../../theme/typography';
import AppIcon from '../common/AppIcon';

/**
 * @description Botón flotante "+" para crear un nuevo registro desde un listado del panel.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onPress - Se ejecuta al tocar el botón
 * @param {string} props.label - Descripción accesible, por ejemplo "Crear noticia"
 * @returns {React.JSX.Element} Botón flotante
 */
const AdminFab = ({ onPress, label }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [styles.fab, { opacity: pressed ? 0.85 : 1 }]}
    accessibilityRole="button"
    accessibilityLabel={label}
  >
    <AppIcon name="add" size={30} color={colors.white} />
  </Pressable>
);

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...cardShadow,
  },
});

export default AdminFab;
