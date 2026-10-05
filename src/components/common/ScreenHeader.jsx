import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../../theme/colors';
import { fontSizes, spacing } from '../../theme/typography';
import AppIcon from './AppIcon';

/**
 * @description Encabezado de pantalla con fondo primario, título en negrita y respeto del área
 *              segura superior. Opcionalmente incluye botón de retroceso y un elemento a la derecha.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título de la pantalla
 * @param {string} [props.subtitle] - Texto secundario bajo el título
 * @param {Function} [props.onBack] - Si se envía, muestra la flecha de retroceso
 * @param {React.ReactNode} [props.right] - Elemento alineado a la derecha
 * @returns {React.JSX.Element} Encabezado
 */
const ScreenHeader = ({ title, subtitle, onBack, right }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingTop: insets.top + spacing.md }]}>
      <View style={styles.row}>
        {onBack ? (
          <Pressable onPress={onBack} hitSlop={10} style={styles.side} accessibilityLabel="Volver">
            <AppIcon name="arrow-back" size={24} color={colors.white} />
          </Pressable>
        ) : null}
        <View style={styles.titles}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        {right ? <View style={styles.side}>{right}</View> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 36,
  },
  side: {
    minWidth: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titles: {
    flex: 1,
  },
  title: {
    fontSize: fontSizes.section,
    fontWeight: '700',
    color: colors.white,
  },
  subtitle: {
    fontSize: fontSizes.small,
    color: colors.pale,
    marginTop: 2,
  },
});

export default ScreenHeader;
