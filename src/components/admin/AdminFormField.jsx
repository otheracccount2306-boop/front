import React from 'react';
import { Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import colors from '../../theme/colors';
import { fontSizes, radius, spacing } from '../../theme/typography';

/**
 * @description Campo de formulario del panel: etiqueta superior con indicador de obligatorio,
 *              soporte multilínea, contador de caracteres opcional y mensaje de error bajo el campo.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Object} props - Propiedades del componente
 * @param {string} props.label - Etiqueta del campo
 * @param {string} props.value - Valor actual
 * @param {Function} props.onChangeText - Se ejecuta al cambiar el texto
 * @param {string} [props.error] - Mensaje de error; pinta el borde de rojo
 * @param {boolean} [props.multiline] - Permite varias líneas
 * @param {number} [props.maxLength] - Longitud máxima
 * @param {boolean} [props.showCount] - Muestra el contador de caracteres
 * @param {boolean} [props.editable] - false para mostrar el campo de solo lectura
 * @param {boolean} [props.required] - Marca el campo como obligatorio
 * @param {Function} [props.onBlur] - Se ejecuta al perder el foco
 * @param {string} [props.placeholder] - Texto de ayuda
 * @param {string} [props.keyboardType] - Tipo de teclado
 * @param {string} [props.autoCapitalize] - Política de mayúsculas automáticas
 * @param {string} [props.testID] - Identificador para pruebas
 * @returns {React.JSX.Element} Campo de formulario
 */
const AdminFormField = ({
  label,
  value,
  onChangeText,
  error,
  multiline = false,
  maxLength,
  showCount = false,
  editable = true,
  required = false,
  onBlur,
  placeholder,
  keyboardType,
  autoCapitalize = 'sentences',
  testID,
}) => (
  <View style={styles.container}>
    <Text style={styles.label}>
      {label}
      {required ? <Text style={styles.required}> *</Text> : null}
    </Text>
    <TextInput
      testID={testID}
      accessibilityLabel={label}
      style={[
        styles.input,
        multiline ? styles.multiline : null,
        error ? styles.inputError : null,
        !editable ? styles.readOnly : null,
      ]}
      value={value}
      onChangeText={onChangeText}
      onBlur={onBlur}
      placeholder={placeholder}
      placeholderTextColor={colors.gray3}
      multiline={multiline}
      maxLength={maxLength}
      editable={editable}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      autoCorrect={false}
    />
    <View style={styles.footer}>
      {error ? <Text style={styles.error}>{error}</Text> : <View />}
      {showCount && maxLength ? (
        <Text style={styles.count}>
          {value.length}/{maxLength}
        </Text>
      ) : null}
    </View>
  </View>
);

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
  required: {
    color: colors.error,
  },
  input: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: colors.gray4,
    borderRadius: radius.input,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fontSizes.body,
    color: colors.gray1,
    ...Platform.select({ web: { outlineStyle: 'none' }, default: {} }),
  },
  multiline: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: colors.error,
  },
  readOnly: {
    backgroundColor: colors.background,
    color: colors.gray2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  error: {
    flex: 1,
    fontSize: fontSizes.small,
    color: colors.error,
  },
  count: {
    fontSize: fontSizes.small,
    color: colors.gray3,
  },
});

export default AdminFormField;
