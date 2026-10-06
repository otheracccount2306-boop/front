import React, { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import SpaceCard from '../../components/campus/SpaceCard';
import SpaceDetailModal from '../../components/campus/SpaceDetailModal';
import AppLoader from '../../components/common/AppLoader';
import CategoryChips from '../../components/common/CategoryChips';
import EmptyState from '../../components/common/EmptyState';
import ErrorBanner from '../../components/common/ErrorBanner';
import ScreenContainer from '../../components/common/ScreenContainer';
import ScreenHeader from '../../components/common/ScreenHeader';
import SegmentedTabs from '../../components/common/SegmentedTabs';
import useSpaces from '../../hooks/useSpaces';
import colors from '../../theme/colors';
import { CAMPUS_MODULE_TABS } from '../../navigation/tabItems';
import { spacing } from '../../theme/typography';
import { ALL_VALUE, SPACE_CHIPS } from '../../utils/category.utils';

const CampusSpacesScreen = ({ navigation }) => {
  const [category, setCategory] = useState(ALL_VALUE);
  const [selected, setSelected] = useState(null);
  const { spaces, loading, error, refresh } = useSpaces(category);

  return (
    <ScreenContainer header={<ScreenHeader title="Campus" subtitle="Espacios y ubicaciones" />}>
      <SegmentedTabs items={CAMPUS_MODULE_TABS} current="CampusSpaces" onChange={(name) => navigation.navigate(name)} />
      <CategoryChips chips={SPACE_CHIPS} selected={category} onSelect={setCategory} />
      {error ? (
        <View style={styles.banner}>
          <ErrorBanner message={error} onRetry={refresh} />
        </View>
      ) : null}
      {loading ? (
        <AppLoader fill />
      ) : (
        <FlatList
          data={spaces}
          keyExtractor={(space) => space.id}
          renderItem={({ item }) => <SpaceCard space={item} onPress={setSelected} />}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={false} onRefresh={refresh} colors={[colors.primary]} />}
          ListEmptyComponent={error ? null : <EmptyState icon="map-outline" message="No hay espacios en esta categoría" />}
        />
      )}
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

export default CampusSpacesScreen;
