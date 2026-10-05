import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { getNewsById } from '../../api/news.api';
import AppIcon from '../../components/common/AppIcon';
import AppLoader from '../../components/common/AppLoader';
import ErrorBanner from '../../components/common/ErrorBanner';
import ScreenContainer from '../../components/common/ScreenContainer';
import ScreenHeader from '../../components/common/ScreenHeader';
import AppBadge from '../../components/common/AppBadge';
import CoverImage from '../../components/news/CoverImage';
import colors from '../../theme/colors';
import { fontSizes, spacing } from '../../theme/typography';
import { categoryLabel } from '../../utils/category.utils';
import { formatLongDate } from '../../utils/date.utils';
import { getErrorMessage } from '../../utils/error.utils';

/**
 * @description Pantalla de detalle de una noticia: portada, categoría, fecha de publicación y
 *              contenido completo. Incluye botón para compartir con la API nativa del dispositivo
 *              y botón de retroceso al listado.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Object} props - Props de navegación de React Navigation
 * @param {Object} props.navigation - Objeto de navegación
 * @param {Object} props.route - Ruta actual; route.params.id es el identificador de la noticia
 * @returns {React.JSX.Element} Pantalla de detalle de noticia
 */
const NewsDetailScreen = ({ navigation, route }) => {
  const { id } = route.params;
  const [news, setNews] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getNewsById(id)
      .then((data) => active && (setNews(data), setError(null)))
      .catch((requestError) => active && setError(getErrorMessage(requestError)))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  const share = async () => {
    if (!news) {
      return;
    }
    try {
      await Share.share({ title: news.titulo, message: `${news.titulo}\n\n${news.resumen || ''}`.trim() });
    } catch {
      return;
    }
  };

  return (
    <ScreenContainer
      header={
        <ScreenHeader
          title="Noticia"
          onBack={() => navigation.goBack()}
          right={
            news ? (
              <Pressable onPress={share} hitSlop={10} accessibilityLabel="Compartir noticia">
                <AppIcon name="share-social-outline" size={24} color={colors.white} />
              </Pressable>
            ) : null
          }
        />
      }
    >
      {loading ? <AppLoader fill /> : null}
      {!loading && error ? (
        <View style={styles.banner}>
          <ErrorBanner message={error} />
        </View>
      ) : null}
      {!loading && news ? (
        <ScrollView contentContainerStyle={styles.content}>
          <CoverImage uri={news.imagenUrl} height={200} />
          <View style={styles.body}>
            <AppBadge label={categoryLabel(news.categoria)} variant="success" />
            <Text style={styles.title}>{news.titulo}</Text>
            <Text style={styles.date}>{formatLongDate(news.publicadoEn)}</Text>
            <Text style={styles.text}>{news.contenido}</Text>
          </View>
        </ScrollView>
      ) : null}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  banner: {
    margin: spacing.lg,
  },
  content: {
    paddingBottom: spacing.xl * 2,
  },
  body: {
    padding: spacing.lg,
  },
  title: {
    fontSize: fontSizes.title,
    fontWeight: '700',
    color: colors.gray1,
    marginTop: spacing.sm,
  },
  date: {
    fontSize: fontSizes.small,
    color: colors.gray3,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  text: {
    fontSize: fontSizes.body,
    color: colors.gray1,
    lineHeight: 22,
  },
});

export default NewsDetailScreen;
