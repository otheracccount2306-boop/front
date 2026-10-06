import React from 'react';
import { StyleSheet, View } from 'react-native';
import AdminMenu from '../components/admin/AdminMenu';
import ConfirmDialog from '../components/common/ConfirmDialog';
import useAdminLogout from '../hooks/useAdminLogout';
import colors from '../theme/colors';
import { spacing } from '../theme/typography';
import { SIDEBAR_WIDTH } from './tabItems';

const AdminSidebar = ({ state, navigation }) => {
  const logout = useAdminLogout();
  const active = state.routes[state.index].name;

  return (
    <View style={styles.sidebar}>
      <AdminMenu
        active={active}
        onSelect={(item) => navigation.navigate(item.name, { screen: item.root })}
        onLogout={logout.open}
      />
      <ConfirmDialog
        visible={logout.visible}
        title="Cerrar sesión"
        message="¿Seguro que quieres cerrar tu sesión de administrador?"
        confirmLabel="Cerrar sesión"
        loading={logout.loading}
        onCancel={logout.close}
        onConfirm={logout.confirm}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: colors.primaryDark,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
});

export default AdminSidebar;
