import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import colors from '../../theme/colors';
import { fontSizes, radius, spacing } from '../../theme/typography';
import { SUBJECT_DAYS } from '../../utils/admin.utils';

const DaysSelector = ({ value, onChange, error }) => {
  const toggle = (day) => {
    const next = value.includes(day) ? value.filter((item) => item !== day) : [...value, day];
    onChange(SUBJECT_DAYS.map((item) => item.value).filter((item) => next.includes(item)));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Días de clase<Text style={styles.required}> *</Text>
      </Text>
      <View style={styles.row}>
        {SUBJECT_DAYS.map((day) => {
          const checked = value.includes(day.value);
          return (
            <Pressable
              key={day.value}
              onPress={() => toggle(day.value)}
              style={[styles.day, checked ? styles.dayChecked : null]}
              accessibilityRole="checkbox"
              accessibilityState={{ checked }}
              accessibilityLabel={day.value}
            >
              <Text style={[styles.dayLabel, checked ? styles.dayLabelChecked : null]}>{day.label}</Text>
            </Pressable>
          );
        })}
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
  required: {
    color: colors.error,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  day: {
    minWidth: 52,
    alignItems: 'center',
    borderRadius: radius.chip,
    borderWidth: 1,
    borderColor: colors.gray4,
    backgroundColor: colors.white,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  dayChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayLabel: {
    fontSize: fontSizes.small,
    fontWeight: '700',
    color: colors.gray2,
  },
  dayLabelChecked: {
    color: colors.white,
  },
  error: {
    fontSize: fontSizes.small,
    color: colors.error,
  },
});

export default DaysSelector;
