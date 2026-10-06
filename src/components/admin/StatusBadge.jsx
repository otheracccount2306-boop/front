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
