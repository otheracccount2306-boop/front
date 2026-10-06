import React, { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import SubjectCard from '../../components/academic/SubjectCard';
import AppLoader from '../../components/common/AppLoader';
import CategoryChips from '../../components/common/CategoryChips';
import EmptyState from '../../components/common/EmptyState';
import ErrorBanner from '../../components/common/ErrorBanner';
import ScreenContainer from '../../components/common/ScreenContainer';
import ScreenHeader from '../../components/common/ScreenHeader';
import SegmentedTabs from '../../components/common/SegmentedTabs';
import useSchedule from '../../hooks/useSchedule';
import { openSpaceOnMap } from '../../navigation/campusLinks';
import colors from '../../theme/colors';
import { spacing } from '../../theme/typography';
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
];

const getInitialDay = () => {
  const today = getDayCode();
  return DAY_CHIPS.some((chip) => chip.value === today) ? today : 'LUNES';
};

const ScheduleScreen = ({ navigation }) => {
  const [day, setDay] = useState(getInitialDay);
  const { schedule, all, loading, error, refresh } = useSchedule(day);
  const noEnrollment = !loading && !error && all.length === 0;

  return (
    <ScreenContainer header={<ScreenHeader title="Académico" subtitle="Tu horario de clases" />}>
      <SegmentedTabs items={MODULE_TABS} current="Schedule" onChange={(name) => navigation.navigate(name)} />
      <CategoryChips chips={DAY_CHIPS} selected={day} onSelect={setDay} />
      {error ? (
        <View style={styles.banner}>
          <ErrorBanner message={error} onRetry={refresh} />
        </View>
      ) : null}
      {loading ? (
        <AppLoader fill />
      ) : (
        <FlatList
          data={schedule}
          keyExtractor={(subject) => subject.id}
          renderItem={({ item }) => (
            <SubjectCard subject={item} onShowOnMap={(subject) => openSpaceOnMap(navigation, subject.espacioId)} />
          )}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={false} onRefresh={refresh} colors={[colors.primary]} />}
          ListEmptyComponent={
            noEnrollment ? (
              <EmptyState icon="school-outline" message="No hay horario disponible para el periodo actual" />
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
  list: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },
});

export default ScheduleScreen;
