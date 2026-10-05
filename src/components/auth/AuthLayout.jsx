import React from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../../theme/colors';
import { fontSizes, spacing } from '../../theme/typography';
import AppIcon from '../common/AppIcon';

/**
 * @description Estructura común de las pantallas de autenticación: banner superior con la marca
 *              UCC, título y subtítulo, y un cuerpo centrado con ancho máximo para el formulario.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título de la pantalla
 * @param {string} [props.subtitle] - Texto secundario bajo el título
 * @param {Function} [props.onBack] - Si se envía, muestra la flecha de retroceso
 * @param {React.ReactNode} props.children - Formulario de la pantalla
 * @returns {React.JSX.Element} Estructura de pantalla de autenticación
 */
const AuthLayout = ({ title, subtitle, onBack, children }) => {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={[styles.hero, { paddingTop: insets.top + spacing.xl }]}>
          {onBack ? (
            <Pressable onPress={onBack} hitSlop={10} style={styles.back} accessibilityLabel="Volver">
              <AppIcon name="arrow-back" size={24} color={colors.white} />
            </Pressable>
          ) : null}
          <Text style={styles.brand}>UCC · Santa Marta</Text>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        <View style={styles.form}>{children}</View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flexGrow: 1,
  },
  hero: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  back: {
    marginBottom: spacing.md,
    alignSelf: 'flex-start',
  },
  brand: {
    fontSize: fontSizes.small,
    fontWeight: '700',
    color: colors.light,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: fontSizes.title,
    fontWeight: '700',
    color: colors.white,
    marginTop: spacing.sm,
  },
  subtitle: {
    fontSize: fontSizes.body,
    color: colors.pale,
    marginTop: spacing.xs,
  },
  form: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    padding: spacing.xl,
  },
});

export default AuthLayout;
