import React, { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import AppLoader from '../../components/common/AppLoader';
import CategoryChips from '../../components/common/CategoryChips';
import EmptyState from '../../components/common/EmptyState';
import ErrorBanner from '../../components/common/ErrorBanner';
import ScreenContainer from '../../components/common/ScreenContainer';
import ScreenHeader from '../../components/common/ScreenHeader';
import SegmentedTabs from '../../components/common/SegmentedTabs';
import DateRangeFilter from '../../components/news/DateRangeFilter';
import EventCard from '../../components/news/EventCard';
import useEvents from '../../hooks/useEvents';
import colors from '../../theme/colors';
import { spacing } from '../../theme/typography';
import { ALL_VALUE, EVENT_CHIPS } from '../../utils/category.utils';

const MODULE_TABS = [
  { name: 'News', label: 'Noticias' },
  { name: 'Events', label: 'Eventos' },
];

const EventsScreen = ({ navigation }) => {
  const [category, setCategory] = useState(ALL_VALUE);
  const [range, setRange] = useState({});
  const { items, loading, refreshing, loadingMore, error, loadMore, refresh } = useEvents({
    category,
    from: range.from,
    to: range.to,
  });

  return (
    <ScreenContainer header={<ScreenHeader title="Noticias" subtitle="Próximos eventos" />}>
      <SegmentedTabs items={MODULE_TABS} current="Events" onChange={(name) => navigation.navigate(name)} />
      <CategoryChips chips={EVENT_CHIPS} selected={category} onSelect={setCategory} />
      <DateRangeFilter from={range.from} to={range.to} onChange={setRange} />
      {error ? (
        <View style={styles.banner}>
          <ErrorBanner message={error} onRetry={refresh} />
        </View>
      ) : null}
      {loading ? (
        <AppLoader fill />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(event) => event.id}
          renderItem={({ item }) => <EventCard event={item} />}
          contentContainerStyle={styles.list}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[colors.primary]} />}
          ListFooterComponent={loadingMore ? <AppLoader size="small" /> : null}
          ListEmptyComponent={error ? null : <EmptyState icon="calendar-outline" message="No hay eventos próximos con estos filtros" />}
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

export default EventsScreen;
