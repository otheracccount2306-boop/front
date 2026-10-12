import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useLogoutConfirm from '../../hooks/useLogoutConfirm';
import { activeMenuKey } from '../../navigation/tabItems';
import colors from '../../theme/colors';
import { spacing } from '../../theme/typography';
import StudentLogoutDialog from './StudentLogoutDialog';
import StudentMenu from './StudentMenu';

/**
 * @description Cajón lateral del menú del estudiante en el celular y en ventanas angostas. Se abre
 *              desde el botón de hamburguesa del encabezado, lleva a la sección elegida o al perfil y
 *              ofrece cerrar sesión con confirmación.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.visible - Muestra u oculta el cajón
 * @param {Function} props.onClose - Se ejecuta al cerrar el cajón
 * @returns {React.JSX.Element} Cajón de navegación
 */
const StudentDrawer = ({ visible, onClose }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const logout = useLogoutConfirm();
  const parent = navigation.getParent();
  const active = visible ? activeMenuKey(parent ? parent.getState() : null) : null;

  const select = (item) => {
    onClose();
    navigation.navigate(item.name, { screen: item.root, initial: item.root !== 'Profile' });
  };

  const requestLogout = () => {
    onClose();
    logout.open();
  };

  return (
    <>
      <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <View style={styles.overlay}>
          <View style={[styles.panel, { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.lg }]}>
            <StudentMenu active={active} onSelect={select} onLogout={requestLogout} />
          </View>
          <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Cerrar menú" />
        </View>
      </Modal>
      <StudentLogoutDialog logout={logout} />
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
    maxWidth: '82%',
    backgroundColor: colors.primaryDark,
    paddingHorizontal: spacing.md,
  },
  backdrop: {
    flex: 1,
  },
});

export default StudentDrawer;
