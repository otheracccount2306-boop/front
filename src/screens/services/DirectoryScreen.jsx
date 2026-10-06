import React, { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import AppLoader from '../../components/common/AppLoader';
import EmptyState from '../../components/common/EmptyState';
import ErrorBanner from '../../components/common/ErrorBanner';
import ScreenContainer from '../../components/common/ScreenContainer';
import ScreenHeader from '../../components/common/ScreenHeader';
import SearchBar from '../../components/common/SearchBar';
import SegmentedTabs from '../../components/common/SegmentedTabs';
import ServiceRow from '../../components/services/ServiceRow';
import useDirectory from '../../hooks/useDirectory';
import colors from '../../theme/colors';
import { spacing } from '../../theme/typography';
import { useDebouncedValue } from '../../utils/debounce.utils';

const MODULE_TABS = [
  { name: 'Wellbeing', label: 'Bienestar' },
  { name: 'Directory', label: 'Directorio' },
  { name: 'Faq', label: 'Preguntas' },
];

const DirectoryScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);
  const { departments, loading, error, refresh } = useDirectory(debouncedSearch);

  return (
    <ScreenContainer header={<ScreenHeader title="Servicios" subtitle="Directorio institucional" />}>
      <SegmentedTabs items={MODULE_TABS} current="Directory" onChange={(name) => navigation.navigate(name)} />
      <SearchBar value={search} onChangeText={setSearch} placeholder="Buscar dependencia" />
      {error ? (
        <View style={styles.banner}>
          <ErrorBanner message={error} onRetry={refresh} />
        </View>
      ) : null}
      {loading ? (
        <AppLoader fill />
      ) : (
        <FlatList
          data={departments}
          keyExtractor={(department) => department.id}
          renderItem={({ item }) => <ServiceRow service={item} />}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={false} onRefresh={refresh} colors={[colors.primary]} />}
          ListEmptyComponent={error ? null : <EmptyState icon="search-outline" message="No encontramos dependencias con ese nombre" />}
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

export default DirectoryScreen;
