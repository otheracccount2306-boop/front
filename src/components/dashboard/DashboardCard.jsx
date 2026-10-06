import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import colors from '../../theme/colors';
import { fontSizes, spacing } from '../../theme/typography';
import AppCard from '../common/AppCard';
import AppIcon from '../common/AppIcon';
import AppLoader from '../common/AppLoader';
import ErrorBanner from '../common/ErrorBanner';

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
