import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useCacheStore from '../../store/cache.store';
import colors from '../../theme/colors';
import { fontSizes, spacing } from '../../theme/typography';
import AppIcon from './AppIcon';

/**
 * @description Banner rojo en la parte superior, visible solo cuando la app no tiene conexión
 *              con el servidor.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @returns {React.JSX.Element|null} Banner, o null cuando hay conexión
 */
const OfflineBanner = () => {
  const isOffline = useCacheStore((state) => state.isOffline);
  const insets = useSafeAreaInsets();
  if (!isOffline) {
    return null;
  }
  return (
    <View style={[styles.banner, { paddingTop: insets.top + spacing.sm }]} accessibilityRole="alert">
      <AppIcon name="cloud-offline-outline" size={16} color={colors.white} />
      <Text style={styles.text}>Sin conexión — mostrando datos guardados</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.error,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  text: {
    marginLeft: spacing.sm,
    fontSize: fontSizes.small,
    fontWeight: '600',
    color: colors.white,
  },
});

export default OfflineBanner;
