import React from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import colors from '../../theme/colors';
import { spacing } from '../../theme/typography';
import AppLoader from '../common/AppLoader';
import EmptyState from '../common/EmptyState';
import ErrorBanner from '../common/ErrorBanner';

/**
 * @description Cuerpo estándar de las pantallas de gestión: muestra el mensaje de confirmación, el
 *              error de carga con reintento, el indicador de carga, la lista con recarga por
 *              deslizamiento y el estado vacío. Deja espacio inferior para el botón flotante.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.data - Elementos a mostrar
 * @param {Function} props.keyExtractor - Devuelve la clave única de un elemento
 * @param {Function} props.renderItem - Renderiza un elemento con la firma de FlatList
 * @param {boolean} props.loading - Muestra el indicador de carga inicial
 * @param {string|null} [props.error] - Error de carga
 * @param {Function} [props.onRetry] - Reintenta la carga
 * @param {string|null} [props.success] - Mensaje de confirmación de la última acción
 * @param {string|null} [props.failure] - Mensaje de error de la última acción
 * @param {boolean} [props.refreshing] - Estado de la recarga por deslizamiento
 * @param {Function} [props.onRefresh] - Recarga por deslizamiento
 * @param {string} props.emptyMessage - Mensaje del estado vacío
 * @param {string} [props.emptyIcon] - Ícono del estado vacío
 * @param {React.ReactNode} [props.footer] - Contenido al final de la lista
 * @param {Function} [props.onEndReached] - Se ejecuta al llegar al final de la lista
 * @returns {React.JSX.Element} Cuerpo de listado
 */
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
