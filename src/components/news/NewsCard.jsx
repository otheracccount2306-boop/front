import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import colors from '../../theme/colors';
import { cardShadow, fontSizes, radius, spacing } from '../../theme/typography';
import { categoryLabel } from '../../utils/category.utils';
import { formatLongDate } from '../../utils/date.utils';
import AppBadge from '../common/AppBadge';
import CoverImage from './CoverImage';

/**
 * @description Tarjeta de una noticia con imagen de portada, categoría, título, resumen y fecha
 *              de publicación.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.news - Noticia en formato resumido
 * @param {Function} props.onPress - Recibe la noticia al tocar la tarjeta
 * @returns {React.JSX.Element} Tarjeta de noticia
 */
const NewsCard = ({ news, onPress }) => (
  <Pressable onPress={() => onPress(news)} style={styles.card} accessibilityRole="button">
    <CoverImage uri={news.imagenUrl} height={140} />
    <View style={styles.content}>
      <AppBadge label={categoryLabel(news.categoria)} variant="success" />
      <Text style={styles.title}>{news.titulo}</Text>
      {news.resumen ? (
        <Text style={styles.summary} numberOfLines={3}>
          {news.resumen}
        </Text>
      ) : null}
      <Text style={styles.date}>{formatLongDate(news.publicadoEn)}</Text>
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.card,
    overflow: 'hidden',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    ...cardShadow,
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    fontSize: fontSizes.section,
    fontWeight: '700',
    color: colors.gray1,
    marginTop: spacing.sm,
  },
  summary: {
    fontSize: fontSizes.body,
    color: colors.gray2,
    marginTop: spacing.xs,
  },
  date: {
    fontSize: fontSizes.small,
    color: colors.gray3,
    marginTop: spacing.sm,
  },
});

export default NewsCard;
