import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import SpaceCard from '../../components/campus/SpaceCard';
import SpaceDetailModal from '../../components/campus/SpaceDetailModal';
import AppLoader from '../../components/common/AppLoader';
import EmptyState from '../../components/common/EmptyState';
import ErrorBanner from '../../components/common/ErrorBanner';
import ScreenContainer from '../../components/common/ScreenContainer';
import ScreenHeader from '../../components/common/ScreenHeader';
import SearchBar from '../../components/common/SearchBar';
import SegmentedTabs from '../../components/common/SegmentedTabs';
import { useSpaceSearch } from '../../hooks/useSpaces';
import { CAMPUS_MODULE_TABS } from '../../navigation/tabItems';
import { spacing } from '../../theme/typography';

const CampusSearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const { results, loading, error, tooShort } = useSpaceSearch(query);

  let content;
  if (tooShort) {
    content = <EmptyState icon="search-outline" message="Ingresa al menos 2 caracteres" />;
  } else if (loading) {
    content = <AppLoader fill />;
  } else {
    content = (
      <FlatList
        data={results}
        keyExtractor={(space) => space.id}
        renderItem={({ item }) => <SpaceCard space={item} onPress={setSelected} />}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={error ? null : <EmptyState icon="search-outline" message="No encontramos espacios con esa búsqueda" />}
      />
    );
  }

  return (
    <ScreenContainer header={<ScreenHeader title="Campus" subtitle="Buscar un espacio" />}>
      <SegmentedTabs items={CAMPUS_MODULE_TABS} current="CampusSearch" onChange={(name) => navigation.navigate(name)} />
      <SearchBar value={query} onChangeText={setQuery} placeholder="Nombre o código, por ejemplo lab" autoFocus />
      {error ? (
        <View style={styles.banner}>
          <ErrorBanner message={error} />
        </View>
      ) : null}
      {content}
      <SpaceDetailModal
        space={selected}
        onClose={() => setSelected(null)}
        onShowOnMap={(space) => {
          setSelected(null);
          navigation.navigate('CampusMap', { spaceId: space.id });
        }}
      />
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

export default CampusSearchScreen;
