import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors, { getCategoryColor } from '../../theme/colors';
import { fontSizes, spacing } from '../../theme/typography';
import { formatTimeRange } from '../../utils/date.utils';
import AppCard from '../common/AppCard';
import AppIcon from '../common/AppIcon';
import ShowOnMapLink from '../campus/ShowOnMapLink';

const SubjectCard = ({ subject, onShowOnMap }) => (
  <AppCard style={styles.card}>
    <View style={[styles.bar, { backgroundColor: getCategoryColor(subject.codigo) }]} />
    <View style={styles.content}>
      <Text style={styles.name}>{subject.nombre}</Text>
      {subject.docente ? <Text style={styles.teacher}>{subject.docente}</Text> : null}
      <View style={styles.metaRow}>
        <View style={styles.meta}>
          <AppIcon name="time-outline" size={14} color={colors.gray2} />
          <Text style={styles.metaText}>{formatTimeRange(subject.horaInicio, subject.horaFin)}</Text>
        </View>
        {subject.aula ? (
          <View style={styles.meta}>
            <AppIcon name="location-outline" size={14} color={colors.gray2} />
            <Text style={styles.metaText}>{subject.aula}</Text>
          </View>
        ) : null}
      </View>
      {onShowOnMap && subject.espacioId ? (
        <ShowOnMapLink onPress={() => onShowOnMap(subject)} style={styles.mapLink} />
      ) : null}
    </View>
  </AppCard>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 0,
    overflow: 'hidden',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  bar: {
    width: 6,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  name: {
    fontSize: fontSizes.body,
    fontWeight: '700',
    color: colors.gray1,
  },
  teacher: {
    fontSize: fontSizes.small,
    color: colors.gray2,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  mapLink: {
    marginTop: spacing.md,
  },
  metaText: {
    fontSize: fontSizes.small,
    color: colors.gray2,
    marginLeft: spacing.xs,
  },
});

export default SubjectCard;
