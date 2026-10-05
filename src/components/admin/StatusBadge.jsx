import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '../../theme/colors';
import { fontSizes, radius, spacing } from '../../theme/typography';

const STATUS_STYLES = {
  PUBLICADO: { label: 'Publicado', background: colors.pale, text: colors.primary },
  ACTIVO: { label: 'Activo', background: colors.pale, text: colors.primary },
  BORRADOR: { label: 'Borrador', background: colors.gray4, text: colors.gray2 },
  CONCLUIDO: { label: 'Concluido', background: colors.gray4, text: colors.gray3 },
  ARCHIVADO: { label: 'Archivado', background: colors.accentLight, text: colors.accent },
  INACTIVO: { label: 'Inactivo', background: colors.accentLight, text: colors.accent },
  CANCELADO: { label: 'Cancelado', background: colors.accentLight, text: colors.accent },
};

/**
 * @description Etiqueta de estado de un recurso. Asigna color y texto según el estado: verde para
 *              PUBLICADO y ACTIVO, gris para BORRADOR y CONCLUIDO, naranja para ARCHIVADO, INACTIVO
 *              y CANCELADO.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Object} props - Propiedades del componente
 * @param {string} props.status - Estado del recurso, por ejemplo PUBLICADO o INACTIVO
 * @returns {React.JSX.Element} Etiqueta de estado
 */
const StatusBadge = ({ status }) => {
  const style = STATUS_STYLES[status] || { label: status, background: colors.gray4, text: colors.gray2 };
  return (
    <View style={[styles.badge, { backgroundColor: style.background }]}>
      <Text style={[styles.label, { color: style.text }]}>{style.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radius.chip,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  label: {
    fontSize: fontSizes.label,
    fontWeight: '700',
  },
});

export default StatusBadge;
