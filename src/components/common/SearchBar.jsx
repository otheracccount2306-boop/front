import React from 'react';
import { Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import colors from '../../theme/colors';
import { fontSizes, radius, spacing } from '../../theme/typography';
import AppIcon from './AppIcon';

/**
 * @description Barra de búsqueda con borde aqua, lupa a la izquierda y botón para limpiar el texto.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Object} props - Propiedades del componente
 * @param {string} props.value - Texto actual
 * @param {Function} props.onChangeText - Se ejecuta al cambiar el texto
 * @param {string} [props.placeholder] - Texto de ayuda
 * @param {boolean} [props.autoFocus] - Enfoca el campo al mostrarse
 * @returns {React.JSX.Element} Barra de búsqueda
 */
const SearchBar = ({ value, onChangeText, placeholder = 'Buscar', autoFocus = false }) => (
  <View style={styles.wrapper}>
    <AppIcon name="search" size={18} color={colors.aqua} />
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.gray3}
      autoFocus={autoFocus}
      autoCapitalize="none"
      autoCorrect={false}
      returnKeyType="search"
    />
    {value ? (
      <Pressable onPress={() => onChangeText('')} hitSlop={8} accessibilityLabel="Borrar búsqueda">
        <AppIcon name="close-circle" size={18} color={colors.gray3} />
      </Pressable>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    minHeight: 44,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.aqua,
    borderRadius: radius.input,
  },
  input: {
    flex: 1,
    marginHorizontal: spacing.sm,
    fontSize: fontSizes.body,
    color: colors.gray1,
    paddingVertical: spacing.sm,
    ...Platform.select({ web: { outlineStyle: 'none' }, default: {} }),
  },
});

export default SearchBar;
