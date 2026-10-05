import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useAdminLogout from '../../hooks/useAdminLogout';
import colors from '../../theme/colors';
import { spacing } from '../../theme/typography';
import ConfirmDialog from '../common/ConfirmDialog';
import AdminMenu from './AdminMenu';

/**
 * @description Cajón lateral del menú administrativo para la versión móvil. Se abre desde el botón de
 *              hamburguesa del encabezado, navega a la sección elegida y ofrece cerrar sesión con
 *              confirmación.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.visible - Muestra u oculta el cajón
 * @param {Function} props.onClose - Se ejecuta al cerrar el cajón
 * @returns {React.JSX.Element} Cajón de navegación
 */
const AdminDrawer = ({ visible, onClose }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const logout = useAdminLogout();
  const parent = navigation.getParent();
  const parentState = parent ? parent.getState() : null;
  const active = parentState ? parentState.routes[parentState.index].name : null;

  const select = (item) => {
    onClose();
    navigation.navigate(item.name, { screen: item.root });
  };

  const requestLogout = () => {
    onClose();
    logout.open();
  };

  return (
    <>
      <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <View style={styles.overlay}>
          <View style={[styles.panel, { paddingTop: insets.top + spacing.xl }]}>
            <AdminMenu active={active} onSelect={select} onLogout={requestLogout} />
          </View>
          <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Cerrar menú" />
        </View>
      </Modal>
      <ConfirmDialog
        visible={logout.visible}
        title="Cerrar sesión"
        message="¿Seguro que quieres cerrar tu sesión de administrador?"
        confirmLabel="Cerrar sesión"
        loading={logout.loading}
        onCancel={logout.close}
        onConfirm={logout.confirm}
      />
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.overlay,
  },
  panel: {
    width: 280,
    backgroundColor: colors.primaryDark,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  backdrop: {
    flex: 1,
  },
});

export default AdminDrawer;
