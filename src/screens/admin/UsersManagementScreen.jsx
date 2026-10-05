import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { deleteUser, listUsers, updateUserRole, updateUserStatus } from '../../api/admin.api';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminListItem from '../../components/admin/AdminListItem';
import AdminListView from '../../components/admin/AdminListView';
import StatusBadge from '../../components/admin/StatusBadge';
import AppButton from '../../components/common/AppButton';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ScreenContainer from '../../components/common/ScreenContainer';
import SearchBar from '../../components/common/SearchBar';
import useAdminActions from '../../hooks/useAdminActions';
import useAuth from '../../hooks/useAuth';
import useFocusRefresh from '../../hooks/useFocusRefresh';
import usePaginated from '../../hooks/usePaginated';
import { spacing } from '../../theme/typography';
import { useDebouncedValue } from '../../utils/debounce.utils';

const ROLE_LABELS = { ESTUDIANTE: 'Estudiante', ADMINISTRADOR: 'Administrador' };

/**
 * @description Pantalla de gestión de usuarios. Lista paginada con búsqueda (debounce de 300 ms) por
 *              nombre, correo o programa. Permite activar o desactivar cuentas, cambiar el rol y
 *              eliminar definitivamente (Ley 1581), con confirmación. El administrador no tiene
 *              acciones sobre su propia cuenta.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @returns {React.JSX.Element} Pantalla de gestión de usuarios
 */
const UsersManagementScreen = () => {
  const { user: me } = useAuth();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);
  const list = usePaginated((page) => listUsers({ search: debouncedSearch, page }), [debouncedSearch]);
  const actions = useAdminActions();
  const [roleTarget, setRoleTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  useFocusRefresh(list.refresh);

  const execute = async (action, message) => {
    if (await actions.run(action, message)) {
      list.refresh();
    }
  };

  const nextRole = roleTarget && roleTarget.rol === 'ADMINISTRADOR' ? 'ESTUDIANTE' : 'ADMINISTRADOR';

  const actionsFor = (target) =>
    target.id === (me && me.id)
      ? []
      : [
          {
            label: target.activo ? 'Desactivar cuenta' : 'Activar cuenta',
            onPress: () =>
              execute(
                () => updateUserStatus(target.id, !target.activo),
                target.activo ? 'Cuenta desactivada correctamente.' : 'Cuenta activada correctamente.',
              ),
          },
          { label: 'Cambiar rol', onPress: () => setRoleTarget(target) },
          { label: 'Eliminar definitivamente', variant: 'danger', onPress: () => setDeleteTarget(target) },
        ];

  return (
    <ScreenContainer header={<AdminHeader title="Usuarios" subtitle="Cuentas y roles" />}>
      <SearchBar value={search} onChangeText={setSearch} placeholder="Buscar por nombre, correo o programa" />
      <AdminListView
        data={list.items}
        keyExtractor={(item) => item.id}
        loading={list.loading}
        error={list.error}
        onRetry={list.refresh}
        success={actions.message}
        failure={actions.error}
        refreshing={list.refreshing}
        onRefresh={list.refresh}
        emptyIcon="people-outline"
        emptyMessage="No se encontraron usuarios"
        renderItem={({ item }) => {
          const isMe = me && item.id === me.id;
          return (
            <AdminListItem
              title={`${item.nombre} ${item.apellido}${isMe ? ' (tú)' : ''}`}
              subtitle={item.correo}
              meta={`${item.programaAcademico || 'Sin programa'} · ${ROLE_LABELS[item.rol] || item.rol}`}
              badge={<StatusBadge status={item.activo ? 'ACTIVO' : 'INACTIVO'} />}
              actions={actionsFor(item)}
            />
          );
        }}
        footer={
          list.hasMore ? (
            <View style={styles.more}>
              <AppButton label="Cargar más" variant="outline" onPress={list.loadMore} loading={list.loadingMore} />
            </View>
          ) : null
        }
      />
      <ConfirmDialog
        visible={Boolean(roleTarget)}
        title="Cambiar rol"
        message={
          roleTarget
            ? `¿Cambiar el rol de ${roleTarget.nombre} ${roleTarget.apellido} a ${ROLE_LABELS[nextRole]}?`
            : ''
        }
        confirmLabel="Cambiar rol"
        onCancel={() => setRoleTarget(null)}
        onConfirm={() => {
          const target = roleTarget;
          setRoleTarget(null);
          execute(() => updateUserRole(target.id, nextRole), `Rol actualizado a ${ROLE_LABELS[nextRole]}.`);
        }}
      />
      <ConfirmDialog
        visible={Boolean(deleteTarget)}
        title="Eliminar usuario"
        message={
          deleteTarget
            ? `Esta acción es permanente e irreversible. Se eliminarán definitivamente los datos de ${deleteTarget.nombre} ${deleteTarget.apellido} (derecho de supresión, Ley 1581 de 2012).`
            : ''
        }
        confirmLabel="Eliminar definitivamente"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          const target = deleteTarget;
          setDeleteTarget(null);
          execute(() => deleteUser(target.id), 'Usuario eliminado definitivamente.');
        }}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  more: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
});

export default UsersManagementScreen;
