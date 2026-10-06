import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '../../theme/colors';
import { cardShadow, fontSizes, radius, spacing } from '../../theme/typography';
import { categoryLabel } from '../../utils/category.utils';
import { formatLongDate, getDateBlock } from '../../utils/date.utils';
import AppBadge from '../common/AppBadge';

const CalendarEventRow = ({ event, highlighted = false }) => {
  const block = getDateBlock(event.fechaInicio);
  const hasRange = event.fechaFin && event.fechaFin !== event.fechaInicio;

  return (
    <View style={[styles.row, highlighted ? styles.rowHighlighted : null]}>
      <View style={styles.dateBlock}>
        <Text style={styles.day}>{block.day}</Text>
        <Text style={styles.month}>{block.month}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{event.nombre}</Text>
        {hasRange ? <Text style={styles.range}>Hasta el {formatLongDate(event.fechaFin)}</Text> : null}
        <View style={styles.badge}>
          <AppBadge label={categoryLabel(event.categoria)} variant={highlighted ? 'success' : 'neutral'} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.card,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    ...cardShadow,
  },
  rowHighlighted: {
    backgroundColor: colors.pale,
  },
  dateBlock: {
    width: 54,
    height: 54,
    borderRadius: radius.card,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  day: {
    fontSize: fontSizes.section,
    fontWeight: '700',
    color: colors.white,
  },
  month: {
    fontSize: fontSizes.label,
    fontWeight: '700',
    color: colors.pale,
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: fontSizes.body,
    fontWeight: '700',
    color: colors.gray1,
  },
  range: {
    fontSize: fontSizes.small,
    color: colors.gray2,
    marginTop: 2,
  },
  badge: {
    marginTop: spacing.xs,
  },
});

export default CalendarEventRow;
