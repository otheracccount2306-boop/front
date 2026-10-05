import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppLoader from '../components/common/AppLoader';
import OfflineBanner from '../components/common/OfflineBanner';
import { bootstrapSession } from '../hooks/useAuth';
import useAuthStore from '../store/auth.store';
import colors from '../theme/colors';
import { fontSizes, spacing } from '../theme/typography';
import AdminNavigator from './AdminNavigator';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

/**
 * @description Pantalla de arranque mostrada mientras se restaura la sesión guardada.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @returns {React.JSX.Element} Pantalla de arranque
 */
const SplashView = () => (
  <View style={styles.splash}>
    <Text style={styles.splashTitle}>UCC Orientación</Text>
    <Text style={styles.splashSubtitle}>Campus Santa Marta</Text>
    <AppLoader color={colors.white} />
  </View>
);

/**
 * @description Navegador raíz. Restaura la sesión al abrir la app y muestra el navegador de
 *              autenticación o el principal según el estado de sesión. Cuando el interceptor
 *              cierra la sesión por un refresh fallido, el cambio del store devuelve al login.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @returns {React.JSX.Element} Navegador raíz
 */
const RootNavigator = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    bootstrapSession().finally(() => setReady(true));
  }, []);

  if (!ready) {
    return <SplashView />;
  }

  return (
    <View style={styles.root}>
      <OfflineBanner />
      <NavigationContainer>
        {!isAuthenticated && <AuthNavigator />}
        {isAuthenticated && user?.rol === 'ADMINISTRADOR' && <AdminNavigator />}
        {isAuthenticated && user?.rol !== 'ADMINISTRADOR' && <MainNavigator />}
      </NavigationContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  splashTitle: {
    fontSize: fontSizes.title,
    fontWeight: '700',
    color: colors.white,
  },
  splashSubtitle: {
    fontSize: fontSizes.body,
    color: colors.pale,
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
});

export default RootNavigator;
