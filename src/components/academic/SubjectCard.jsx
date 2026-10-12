import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import colors, { getCategoryColor } from '../../theme/colors';
import { useCardGutter } from '../../theme/layout';
import { fontSizes, spacing } from '../../theme/typography';
import { formatTimeRange } from '../../utils/date.utils';
import { isPersonalClass } from '../../utils/personalClass.utils';
import AppBadge from '../common/AppBadge';
import AppCard from '../common/AppCard';
import AppIcon from '../common/AppIcon';
import ShowOnMapLink from '../campus/ShowOnMapLink';

/**
 * @description Tarjeta de una asignatura del horario con barra de color a la izquierda, nombre,
 *              docente, aula y franja horaria. Si el aula está ubicada en el mapa del campus
 *              (subject.espacioId), muestra el enlace "Ver en mapa". Las clases que registró el
 *              propio estudiante llevan la etiqueta "Mi clase" y un botón para editarlas.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.subject - Asignatura del horario
 * @param {Function} [props.onShowOnMap] - Recibe la asignatura para abrir su aula en el mapa
 * @param {Function} [props.onEdit] - Recibe la clase personal para editarla
 * @returns {React.JSX.Element} Tarjeta de asignatura
 */
const SubjectCard = ({ subject, onShowOnMap, onEdit }) => {
  const gutter = useCardGutter();
  const personal = isPersonalClass(subject);
  return (
    <AppCard style={[styles.card, { marginHorizontal: gutter }]}>
      <View style={[styles.bar, { backgroundColor: personal ? colors.aqua : getCategoryColor(subject.codigo) }]} />
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <View style={styles.titleText}>
            <Text style={styles.name}>{subject.nombre}</Text>
            {personal ? (
              <View style={styles.badge}>
                <AppBadge label="Mi clase" variant="neutral" />
              </View>
            ) : null}
          </View>
          {personal && onEdit ? (
            <Pressable
              onPress={() => onEdit(subject)}
              hitSlop={8}
              style={styles.editButton}
              accessibilityRole="button"
              accessibilityLabel={`Editar ${subject.nombre}`}
            >
              <AppIcon name="create-outline" size={20} color={colors.primary} />
            </Pressable>
          ) : null}
        </View>
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
};

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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  titleText: {
    flex: 1,
  },
  badge: {
    flexDirection: 'row',
    marginTop: spacing.xs,
  },
  editButton: {
    width: 44,
    height: 44,
    marginTop: -spacing.md,
    marginRight: -spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
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
