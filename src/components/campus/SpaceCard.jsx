import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import colors, { getCategoryColor } from '../../theme/colors';
import { cardShadow, fontSizes, radius, spacing } from '../../theme/typography';
import { categoryLabel } from '../../utils/category.utils';
import AppBadge from '../common/AppBadge';
import AppIcon from '../common/AppIcon';

/**
 * @description Tarjeta de un espacio del campus con franja de color superior, nombre, categoría,
 *              ubicación y referencia para llegar.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.space - Espacio del campus
 * @param {Function} props.onPress - Se ejecuta al tocar la tarjeta
 * @returns {React.JSX.Element} Tarjeta de espacio
 */
const SpaceCard = ({ space, onPress }) => {
  const location = [space.edificio, space.piso].filter(Boolean).join(' · ');

  return (
    <Pressable onPress={() => onPress(space)} style={styles.card} accessibilityRole="button">
      <View style={[styles.strip, { backgroundColor: getCategoryColor(space.categoria) }]} />
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.name}>{space.nombre}</Text>
          <Text style={styles.code}>{space.codigo}</Text>
        </View>
        <AppBadge label={categoryLabel(space.categoria)} variant="success" />
        {location ? (
          <View style={styles.meta}>
            <AppIcon name="location-outline" size={14} color={colors.gray2} />
            <Text style={styles.metaText}>{location}</Text>
          </View>
        ) : null}
        {space.referencia ? (
          <Text style={styles.reference} numberOfLines={2}>
            {space.referencia}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.card,
    overflow: 'hidden',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    ...cardShadow,
  },
  strip: {
    height: 6,
  },
  content: {
    padding: spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  name: {
    flex: 1,
    fontSize: fontSizes.body,
    fontWeight: '700',
    color: colors.gray1,
    marginRight: spacing.sm,
  },
  code: {
    fontSize: fontSizes.small,
    fontWeight: '600',
    color: colors.gray3,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  metaText: {
    fontSize: fontSizes.small,
    color: colors.gray2,
    marginLeft: spacing.xs,
  },
  reference: {
    fontSize: fontSizes.small,
    color: colors.gray2,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
});

export default SpaceCard;
