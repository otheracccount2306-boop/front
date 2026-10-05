import React, { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import CalendarEventRow from '../../components/academic/CalendarEventRow';
import AppLoader from '../../components/common/AppLoader';
import CategoryChips from '../../components/common/CategoryChips';
import EmptyState from '../../components/common/EmptyState';
import ErrorBanner from '../../components/common/ErrorBanner';
import ScreenContainer from '../../components/common/ScreenContainer';
import ScreenHeader from '../../components/common/ScreenHeader';
import SegmentedTabs from '../../components/common/SegmentedTabs';
import useCalendar from '../../hooks/useCalendar';
import colors from '../../theme/colors';
import { spacing } from '../../theme/typography';
import { ALL_VALUE, CALENDAR_CHIPS } from '../../utils/category.utils';
import { isWithinNextDays } from '../../utils/date.utils';

const MODULE_TABS = [
  { name: 'Schedule', label: 'Horario' },
  { name: 'Calendar', label: 'Calendario' },
];

const HIGHLIGHT_DAYS = 7;

/**
 * @description Pantalla del calendario académico institucional con filtro por categoría. Lista los
 *              eventos en orden cronológico y resalta los que ocurren dentro de los próximos 7 días.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {Object} props - Props de navegación de React Navigation
 * @param {Object} props.navigation - Objeto de navegación
 * @returns {React.JSX.Element} Pantalla de calendario
 */
const CalendarScreen = ({ navigation }) => {
  const [category, setCategory] = useState(ALL_VALUE);
  const { events, loading, error, refresh } = useCalendar(category);

  return (
    <ScreenContainer header={<ScreenHeader title="Académico" subtitle="Calendario institucional" />}>
      <SegmentedTabs items={MODULE_TABS} current="Calendar" onChange={(name) => navigation.navigate(name)} />
      <CategoryChips chips={CALENDAR_CHIPS} selected={category} onSelect={setCategory} />
      {error ? (
        <View style={styles.banner}>
          <ErrorBanner message={error} onRetry={refresh} />
        </View>
      ) : null}
      {loading ? (
        <AppLoader fill />
      ) : (
        <FlatList
          data={events}
          keyExtractor={(event) => event.id}
          renderItem={({ item }) => (
            <CalendarEventRow event={item} highlighted={isWithinNextDays(item.fechaInicio, HIGHLIGHT_DAYS)} />
          )}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={false} onRefresh={refresh} colors={[colors.primary]} />}
          ListEmptyComponent={error ? null : <EmptyState icon="calendar-outline" message="No hay eventos en esta categoría" />}
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

export default CalendarScreen;
