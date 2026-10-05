import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors, { getCategoryColor } from '../../theme/colors';
import { fontSizes, spacing } from '../../theme/typography';
import { categoryLabel } from '../../utils/category.utils';
import { formatEventDateTime, isInCurrentWeek } from '../../utils/date.utils';
import AppBadge from '../common/AppBadge';
import AppCard from '../common/AppCard';
import AppIcon from '../common/AppIcon';

/**
 * @description Tarjeta de un evento con barra de color por categoría, nombre, fecha y hora,
 *              lugar y cupos. Los eventos de la semana en curso se destacan con fondo pale.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.event - Evento institucional
 * @returns {React.JSX.Element} Tarjeta de evento
 */
const EventCard = ({ event }) => {
  const thisWeek = isInCurrentWeek(event.fechaHora);

  return (
    <AppCard style={[styles.card, thisWeek ? styles.cardHighlighted : null]}>
      <View style={[styles.bar, { backgroundColor: getCategoryColor(event.categoria) }]} />
      <View style={styles.content}>
        <View style={styles.badges}>
          <AppBadge label={categoryLabel(event.categoria)} variant="success" />
          {thisWeek ? <AppBadge label="Esta semana" variant="warning" /> : null}
        </View>
        <Text style={styles.name}>{event.nombre}</Text>
        <View style={styles.meta}>
          <AppIcon name="calendar-outline" size={14} color={colors.gray2} />
          <Text style={styles.metaText}>{formatEventDateTime(event.fechaHora)}</Text>
        </View>
        {event.lugar ? (
          <View style={styles.meta}>
            <AppIcon name="location-outline" size={14} color={colors.gray2} />
            <Text style={styles.metaText}>{event.lugar}</Text>
          </View>
        ) : null}
        {event.cupos !== null && event.cupos !== undefined ? (
          <View style={styles.meta}>
            <AppIcon name="people-outline" size={14} color={colors.gray2} />
            <Text style={styles.metaText}>Cupos: {event.cupos}</Text>
          </View>
        ) : null}
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 0,
    overflow: 'hidden',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  cardHighlighted: {
    backgroundColor: colors.pale,
  },
  bar: {
    width: 6,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  badges: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  name: {
    fontSize: fontSizes.body,
    fontWeight: '700',
    color: colors.gray1,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  metaText: {
    fontSize: fontSizes.small,
    color: colors.gray2,
    marginLeft: spacing.xs,
  },
});

export default EventCard;
