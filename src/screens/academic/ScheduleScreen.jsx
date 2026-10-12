import React, { useState } from 'react';
import { Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import SubjectCard from '../../components/academic/SubjectCard';
import AppIcon from '../../components/common/AppIcon';
import AppLoader from '../../components/common/AppLoader';
import CategoryChips from '../../components/common/CategoryChips';
import EmptyState from '../../components/common/EmptyState';
import ErrorBanner from '../../components/common/ErrorBanner';
import ResponsiveList from '../../components/common/ResponsiveList';
import ScreenContainer from '../../components/common/ScreenContainer';
import ScreenHeader from '../../components/common/ScreenHeader';
import SegmentedTabs from '../../components/common/SegmentedTabs';
import useSchedule from '../../hooks/useSchedule';
import { openSpaceOnMap } from '../../navigation/campusLinks';
import colors from '../../theme/colors';
import { fontSizes, radius, spacing } from '../../theme/typography';
import { getDayCode } from '../../utils/date.utils';

const MODULE_TABS = [
  { name: 'Schedule', label: 'Horario' },
  { name: 'Calendar', label: 'Calendario' },
];

const DAY_CHIPS = [
  { value: 'LUNES', label: 'LUN' },
  { value: 'MARTES', label: 'MAR' },
  { value: 'MIERCOLES', label: 'MIE' },
  { value: 'JUEVES', label: 'JUE' },
  { value: 'VIERNES', label: 'VIE' },
  { value: 'SABADO', label: 'SÁB' },
  { value: 'DOMINGO', label: 'DOM' },
];

const getInitialDay = () => {
  const today = getDayCode();
  return DAY_CHIPS.some((chip) => chip.value === today) ? today : 'LUNES';
};

const ScheduleScreen = ({ navigation }) => {
  const [day, setDay] = useState(getInitialDay);
  const { schedule, all, loading, error, refresh } = useSchedule(day);
  const noEnrollment = !loading && !error && all.length === 0;
  const addClass = () => navigation.navigate('PersonalClassForm', { day });
  const editClass = (subject) => navigation.navigate('PersonalClassForm', { subject });

  return (
    <ScreenContainer header={<ScreenHeader title="Académico" subtitle="Tu horario de clases" />}>
      <SegmentedTabs items={MODULE_TABS} current="Schedule" onChange={(name) => navigation.navigate(name)} />
      <CategoryChips chips={DAY_CHIPS} selected={day} onSelect={setDay} />
      <Pressable
        onPress={addClass}
        style={({ pressed }) => [styles.addButton, pressed && styles.addPressed]}
        accessibilityRole="button"
        accessibilityLabel="Agregar una clase a mi horario"
      >
        <AppIcon name="add-circle-outline" size={20} color={colors.primary} />
        <Text style={styles.addText}>Agregar clase</Text>
      </Pressable>
      {error ? (
        <View style={styles.banner}>
          <ErrorBanner message={error} onRetry={refresh} />
        </View>
      ) : null}
      {loading ? (
        <AppLoader fill />
      ) : (
        <ResponsiveList
          data={schedule}
          keyExtractor={(subject) => subject.id}
          renderItem={({ item }) => (
            <SubjectCard
              subject={item}
              onShowOnMap={(subject) => openSpaceOnMap(navigation, subject.espacioId)}
              onEdit={editClass}
            />
          )}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={false} onRefresh={refresh} colors={[colors.primary]} />}
          ListEmptyComponent={
            noEnrollment ? (
              <EmptyState
                icon="school-outline"
                message="Aún no tienes clases. Agrega las tuyas con el botón Agregar clase."
              />
            ) : error ? null : (
              <EmptyState icon="cafe-outline" message="No hay clases programadas para este día" />
            )
          }
        />
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: spacing.lg,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    minHeight: 44,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.chip,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  addPressed: {
    backgroundColor: colors.pale,
  },
  addText: {
    fontSize: fontSizes.body,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: spacing.sm,
  },
  list: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },
});

export default ScheduleScreen;
