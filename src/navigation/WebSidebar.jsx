import React from 'react';
import { StyleSheet, View } from 'react-native';
import StudentLogoutDialog from '../components/navigation/StudentLogoutDialog';
import StudentMenu from '../components/navigation/StudentMenu';
import useLogoutConfirm from '../hooks/useLogoutConfirm';
import colors from '../theme/colors';
import { spacing } from '../theme/typography';
import { SIDEBAR_WIDTH, activeMenuKey } from './tabItems';

/**
 * @description Menú lateral fijo para la versión web en pantallas anchas. Muestra el mismo menú que
 *              el botón de hamburguesa del celular: las cinco secciones, Mi perfil y Cerrar sesión.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Object} props - Propiedades entregadas por el Tab Navigator
 * @param {Object} props.state - Estado de navegación de las pestañas
 * @param {Object} props.navigation - Objeto de navegación de las pestañas
 * @returns {React.JSX.Element} Menú lateral
 */
const WebSidebar = ({ state, navigation }) => {
  const logout = useLogoutConfirm();
  const select = (item) => navigation.navigate(item.name, { screen: item.root, initial: item.root !== 'Profile' });

  return (
    <View style={styles.sidebar}>
      <StudentMenu active={activeMenuKey(state)} onSelect={select} onLogout={logout.open} />
      <StudentLogoutDialog logout={logout} />
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
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
});

export default WebSidebar;
