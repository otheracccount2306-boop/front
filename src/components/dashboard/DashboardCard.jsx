import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import colors from '../../theme/colors';
import { fontSizes, spacing } from '../../theme/typography';
import AppCard from '../common/AppCard';
import AppIcon from '../common/AppIcon';
import AppLoader from '../common/AppLoader';
import ErrorBanner from '../common/ErrorBanner';

/**
 * @description Tarjeta del dashboard con título e ícono. Muestra su propio estado de carga y su
 *              propio error, de modo que la falla de un módulo no afecte a los demás.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título de la tarjeta
 * @param {string} props.icon - Ícono de Ionicons
 * @param {boolean} [props.loading] - Muestra el indicador de carga
 * @param {string|null} [props.error] - Mensaje de error localizado en esta tarjeta
 * @param {Function} [props.onPress] - Si se envía, la tarjeta es tocable
 * @param {React.ReactNode} props.children - Contenido de la tarjeta
 * @returns {React.JSX.Element} Tarjeta del dashboard
 */
const DashboardCard = ({ title, icon, loading = false, error = null, onPress, children }) => {
  const body = (
    <AppCard style={styles.card}>
      <View style={styles.header}>
        <AppIcon name={icon} size={18} color={colors.primary} />
        <Text style={styles.title}>{title}</Text>
      </View>
      {loading ? <AppLoader size="small" /> : null}
      {!loading && error ? <ErrorBanner message={error} /> : null}
      {!loading && !error ? children : null}
    </AppCard>
  );

  return onPress ? (
    <Pressable onPress={onPress} accessibilityRole="button">
      {body}
    </Pressable>
  ) : (
    body
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: fontSizes.small,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    marginLeft: spacing.sm,
  },
});

export default DashboardCard;
