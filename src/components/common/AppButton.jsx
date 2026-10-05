import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import colors from '../../theme/colors';
import { fontSizes, radius, spacing } from '../../theme/typography';
import AppLoader from './AppLoader';

const VARIANTS = {
  primary: { background: colors.primary, border: colors.primary, text: colors.white },
  outline: { background: colors.white, border: colors.primary, text: colors.primary },
  danger: { background: colors.error, border: colors.error, text: colors.white },
};

/**
 * @description Botón con tres variantes visuales. Muestra un indicador de carga y se bloquea
 *              mientras loading sea true.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Object} props - Propiedades del componente
 * @param {string} props.label - Texto del botón
 * @param {Function} props.onPress - Acción al presionar
 * @param {'primary'|'outline'|'danger'} [props.variant] - Variante visual
 * @param {boolean} [props.disabled] - Deshabilita el botón
 * @param {boolean} [props.loading] - Muestra el indicador de carga
 * @param {Object} [props.style] - Estilos adicionales
 * @returns {React.JSX.Element} Botón
 */
const AppButton = ({ label, onPress, variant = 'primary', disabled = false, loading = false, style }) => {
  const palette = VARIANTS[variant] || VARIANTS.primary;
  const blocked = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: blocked }}
      disabled={blocked}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: palette.background, borderColor: palette.border },
        { opacity: blocked ? 0.5 : pressed ? 0.85 : 1 },
        style,
      ]}
    >
      {loading ? (
        <AppLoader size="small" color={palette.text} />
      ) : (
        <Text style={[styles.label, { color: palette.text }]}>{label}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    minHeight: 46,
    borderRadius: radius.input,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: fontSizes.body,
    fontWeight: '700',
  },
});

export default AppButton;
