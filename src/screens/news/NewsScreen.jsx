import React, { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import AppLoader from '../../components/common/AppLoader';
import CategoryChips from '../../components/common/CategoryChips';
import EmptyState from '../../components/common/EmptyState';
import ErrorBanner from '../../components/common/ErrorBanner';
import ScreenContainer from '../../components/common/ScreenContainer';
import ScreenHeader from '../../components/common/ScreenHeader';
import SegmentedTabs from '../../components/common/SegmentedTabs';
import NewsCard from '../../components/news/NewsCard';
import useNews from '../../hooks/useNews';
import colors from '../../theme/colors';
import { spacing } from '../../theme/typography';
import { ALL_VALUE, NEWS_CHIPS } from '../../utils/category.utils';

const MODULE_TABS = [
  { name: 'News', label: 'Noticias' },
  { name: 'Events', label: 'Eventos' },
];

/**
 * @description Pantalla de noticias institucionales con filtro por categoría y scroll infinito de
 *              10 en 10. Al tocar una noticia abre su detalle.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Object} props - Props de navegación de React Navigation
 * @param {Object} props.navigation - Objeto de navegación
 * @returns {React.JSX.Element} Pantalla de noticias
 */
const NewsScreen = ({ navigation }) => {
  const [category, setCategory] = useState(ALL_VALUE);
  const { items, loading, refreshing, loadingMore, error, loadMore, refresh } = useNews(category);

  return (
    <ScreenContainer header={<ScreenHeader title="Noticias" subtitle="Lo último en la UCC" />}>
      <SegmentedTabs items={MODULE_TABS} current="News" onChange={(name) => navigation.navigate(name)} />
      <CategoryChips chips={NEWS_CHIPS} selected={category} onSelect={setCategory} />
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
          keyExtractor={(news) => news.id}
          renderItem={({ item }) => (
            <NewsCard news={item} onPress={(news) => navigation.navigate('NewsDetail', { id: news.id })} />
          )}
          contentContainerStyle={styles.list}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[colors.primary]} />}
          ListFooterComponent={loadingMore ? <AppLoader size="small" /> : null}
          ListEmptyComponent={error ? null : <EmptyState icon="newspaper-outline" message="No hay noticias publicadas" />}
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

export default NewsScreen;
