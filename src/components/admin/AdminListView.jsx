import React from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import colors from '../../theme/colors';
import { spacing } from '../../theme/typography';
import AppLoader from '../common/AppLoader';
import EmptyState from '../common/EmptyState';
import ErrorBanner from '../common/ErrorBanner';

const AdminListView = ({
  data,
  keyExtractor,
  renderItem,
  loading,
  error,
  onRetry,
  success,
  failure,
  refreshing = false,
  onRefresh,
  emptyMessage,
  emptyIcon = 'file-tray-outline',
  footer,
  onEndReached,
}) => (
  <View style={styles.container}>
    {success ? (
      <View style={styles.banner}>
        <ErrorBanner variant="success" message={success} />
      </View>
    ) : null}
    {failure ? (
      <View style={styles.banner}>
        <ErrorBanner message={failure} />
      </View>
    ) : null}
    {error ? (
      <View style={styles.banner}>
        <ErrorBanner message={error} onRetry={onRetry} />
      </View>
    ) : null}
    {loading ? (
      <AppLoader fill />
    ) : (
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.4}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh || onRetry} colors={[colors.primary]} />
        }
        ListFooterComponent={footer}
        ListEmptyComponent={error ? null : <EmptyState icon={emptyIcon} message={emptyMessage} />}
      />
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  banner: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  list: {
    flexGrow: 1,
    paddingTop: spacing.md,
    paddingBottom: 96,
  },
});

export default AdminListView;
