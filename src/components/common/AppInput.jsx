import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import colors from '../../theme/colors';
import { fontSizes, radius, spacing } from '../../theme/typography';
import AppIcon from './AppIcon';

/**
 * @description Campo de texto con etiqueta y mensaje de error. Cuando secureTextEntry es true
 *              incluye un ojo para mostrar u ocultar el contenido.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.label] - Etiqueta sobre el campo
 * @param {string} props.value - Valor actual
 * @param {Function} props.onChangeText - Se ejecuta al cambiar el texto
 * @param {string} [props.placeholder] - Texto de ayuda
 * @param {boolean} [props.secureTextEntry] - Oculta el texto y muestra el ojo
 * @param {string} [props.error] - Mensaje de error; si existe el borde se pinta de rojo
 * @param {boolean} [props.editable] - false para mostrar el campo de solo lectura
 * @param {Function} [props.onBlur] - Se ejecuta al perder el foco
 * @param {string} [props.keyboardType] - Tipo de teclado
 * @param {string} [props.autoCapitalize] - Política de mayúsculas automáticas
 * @param {number} [props.maxLength] - Longitud máxima
 * @param {string} [props.testID] - Identificador para pruebas
 * @returns {React.JSX.Element} Campo de texto
 */
const AppInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error,
  editable = true,
  onBlur,
  keyboardType,
  autoCapitalize = 'none',
  maxLength,
  testID,
}) => {
  const [hidden, setHidden] = useState(true);
  const hideText = secureTextEntry && hidden;

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={[
          styles.field,
          error ? styles.fieldError : null,
          !editable ? styles.fieldReadOnly : null,
        ]}
      >
        <TextInput
          testID={testID}
          style={[styles.input, !editable ? styles.inputReadOnly : null]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.gray3}
          secureTextEntry={hideText}
          editable={editable}
          onBlur={onBlur}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          maxLength={maxLength}
        />
        {secureTextEntry ? (
          <Pressable
            onPress={() => setHidden((previous) => !previous)}
            hitSlop={8}
            accessibilityLabel={hidden ? 'Mostrar contraseña' : 'Ocultar contraseña'}
          >
            <AppIcon name={hidden ? 'eye-outline' : 'eye-off-outline'} size={20} color={colors.gray2} />
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: fontSizes.small,
    fontWeight: '600',
    color: colors.gray1,
    marginBottom: spacing.xs,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 46,
    borderWidth: 1,
    borderColor: colors.gray4,
    borderRadius: radius.input,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
  },
  fieldError: {
    borderColor: colors.error,
  },
  fieldReadOnly: {
    backgroundColor: colors.background,
  },
  input: {
    flex: 1,
    fontSize: fontSizes.body,
    color: colors.gray1,
    paddingVertical: spacing.sm,
    ...Platform.select({ web: { outlineStyle: 'none' }, default: {} }),
  },
  inputReadOnly: {
    color: colors.gray2,
  },
  error: {
    fontSize: fontSizes.small,
    color: colors.error,
    marginTop: spacing.xs,
  },
});

export default AppInput;
