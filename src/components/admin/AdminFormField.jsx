import React from 'react';
import { Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import colors from '../../theme/colors';
import { fontSizes, radius, spacing } from '../../theme/typography';

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
