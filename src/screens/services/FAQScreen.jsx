import React, { useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import AppLoader from '../../components/common/AppLoader';
import CategoryChips from '../../components/common/CategoryChips';
import EmptyState from '../../components/common/EmptyState';
import ErrorBanner from '../../components/common/ErrorBanner';
import ScreenContainer from '../../components/common/ScreenContainer';
import ScreenHeader from '../../components/common/ScreenHeader';
import SearchBar from '../../components/common/SearchBar';
import SegmentedTabs from '../../components/common/SegmentedTabs';
import AccordionItem from '../../components/services/AccordionItem';
import useFaq from '../../hooks/useFaq';
import colors from '../../theme/colors';
import { spacing } from '../../theme/typography';
import { ALL_VALUE, buildChipsFromItems } from '../../utils/category.utils';
import { useDebouncedValue } from '../../utils/debounce.utils';

const MODULE_TABS = [
  { name: 'Wellbeing', label: 'Bienestar' },
  { name: 'Directory', label: 'Directorio' },
  { name: 'Faq', label: 'Preguntas' },
];

const FAQScreen = ({ navigation }) => {
  const [category, setCategory] = useState(ALL_VALUE);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);
  const { faq, all, loading, error, refresh } = useFaq(category, debouncedSearch);
  const chips = useMemo(() => buildChipsFromItems(all, 'Todas'), [all]);

  return (
    <ScreenContainer header={<ScreenHeader title="Servicios" subtitle="Preguntas frecuentes" />}>
      <SegmentedTabs items={MODULE_TABS} current="Faq" onChange={(name) => navigation.navigate(name)} />
      <SearchBar value={search} onChangeText={setSearch} placeholder="Buscar en preguntas frecuentes" />
      <CategoryChips chips={chips} selected={category} onSelect={setCategory} />
      {error ? (
        <View style={styles.banner}>
          <ErrorBanner message={error} onRetry={refresh} />
        </View>
      ) : null}
      {loading ? (
        <AppLoader fill />
      ) : (
        <FlatList
          data={faq}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <AccordionItem question={item.pregunta} answer={item.respuesta} />}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={false} onRefresh={refresh} colors={[colors.primary]} />}
          ListEmptyComponent={error ? null : <EmptyState icon="help-circle-outline" message="No encontramos preguntas con ese criterio" />}
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

export default FAQScreen;
