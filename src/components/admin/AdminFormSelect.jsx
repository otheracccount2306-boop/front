import React, { useState } from 'react';
import { Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import colors from '../../theme/colors';
import { cardShadow, fontSizes, radius, spacing } from '../../theme/typography';
import AppIcon from '../common/AppIcon';

const WEB_SELECT_STYLE = {
  minHeight: 46,
  width: '100%',
  boxSizing: 'border-box',
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: colors.gray4,
  borderRadius: radius.input,
  backgroundColor: colors.white,
  paddingLeft: spacing.md,
  paddingRight: spacing.md,
  fontSize: fontSizes.body,
  color: colors.gray1,
};

const AdminFormSelect = ({
  label,
  value,
  onChange,
  options,
  error,
  required = false,
  disabled = false,
  placeholder = 'Selecciona una opción',
}) => {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  const control =
    Platform.OS === 'web' ? (
      <select
        aria-label={label}
        value={value || ''}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        style={WEB_SELECT_STYLE}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
    ) : (
      <>
        <Pressable
          style={[styles.field, error ? styles.fieldError : null, disabled ? styles.fieldDisabled : null]}
          disabled={disabled}
          onPress={() => setOpen(true)}
          accessibilityRole="button"
          accessibilityLabel={label}
        >
          <Text style={[styles.value, selected ? null : styles.placeholder]}>{selected ? selected.label : placeholder}</Text>
          <AppIcon name="chevron-down" size={18} color={colors.gray2} />
        </Pressable>
        <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
          <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
            <View style={styles.sheet}>
              <Text style={styles.sheetTitle}>{label}</Text>
              <ScrollView>
                {options.map((option) => (
                  <Pressable
                    key={option.value}
                    disabled={option.disabled}
                    style={styles.option}
                    onPress={() => {
                      setOpen(false);
                      onChange(option.value);
                    }}
                  >
                    <Text
                      style={[
                        styles.optionLabel,
                        option.value === value ? styles.optionSelected : null,
                        option.disabled ? styles.optionDisabled : null,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </Pressable>
        </Modal>
      </>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required ? <Text style={styles.required}> *</Text> : null}
      </Text>
      {control}
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
  required: {
    color: colors.error,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  fieldDisabled: {
    backgroundColor: colors.background,
  },
  value: {
    fontSize: fontSizes.body,
    color: colors.gray1,
  },
  placeholder: {
    color: colors.gray3,
  },
  error: {
    fontSize: fontSizes.small,
    color: colors.error,
    marginTop: spacing.xs,
  },
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  sheet: {
    width: '100%',
    maxWidth: 360,
    maxHeight: '70%',
    backgroundColor: colors.white,
    borderRadius: radius.card,
    paddingVertical: spacing.sm,
    ...cardShadow,
  },
  sheetTitle: {
    fontSize: fontSizes.small,
    fontWeight: '700',
    color: colors.gray3,
    textTransform: 'uppercase',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  option: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  optionLabel: {
    fontSize: fontSizes.body,
    color: colors.gray1,
  },
  optionSelected: {
    color: colors.primary,
    fontWeight: '700',
  },
  optionDisabled: {
    color: colors.gray3,
  },
});

export default AdminFormSelect;
