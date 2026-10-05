import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing } from '../../theme/typography';
import { getMonthRange, getWeekRange } from '../../utils/date.utils';
import { isValidDateInput } from '../../utils/validation.utils';
import AppInput from '../common/AppInput';
import CategoryChips from '../common/CategoryChips';

const PRESETS = [
  { value: 'ALL', label: 'Todas las fechas' },
  { value: 'WEEK', label: 'Esta semana' },
  { value: 'MONTH', label: 'Este mes' },
];

/**
 * @description Selector de rango de fechas para los eventos: atajos (todas, esta semana, este
 *              mes) y dos campos Desde y Hasta con formato AAAA-MM-DD. Solo notifica rangos válidos.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.from] - Fecha inicial aplicada
 * @param {string} [props.to] - Fecha final aplicada
 * @param {Function} props.onChange - Recibe { from, to } cuando el rango es válido
 * @returns {React.JSX.Element} Selector de rango de fechas
 */
const DateRangeFilter = ({ from, to, onChange }) => {
  const [fromText, setFromText] = useState(from || '');
  const [toText, setToText] = useState(to || '');

  const fromError = fromText && !isValidDateInput(fromText) ? 'Usa AAAA-MM-DD' : null;
  const toError = toText && !isValidDateInput(toText) ? 'Usa AAAA-MM-DD' : null;
  const orderError = !fromError && !toError && fromText && toText && toText < fromText ? 'Fecha final anterior' : null;

  const apply = (nextFrom, nextTo) => {
    setFromText(nextFrom);
    setToText(nextTo);
    const validFrom = !nextFrom || isValidDateInput(nextFrom);
    const validTo = !nextTo || isValidDateInput(nextTo);
    const ordered = !(nextFrom && nextTo && nextTo < nextFrom);
    if (validFrom && validTo && ordered) {
      onChange({ from: nextFrom || undefined, to: nextTo || undefined });
    }
  };

  const selectPreset = (value) => {
    if (value === 'WEEK') {
      const range = getWeekRange();
      apply(range.from, range.to);
    } else if (value === 'MONTH') {
      const range = getMonthRange();
      apply(range.from, range.to);
    } else {
      apply('', '');
    }
  };

  const weekRange = getWeekRange();
  const monthRange = getMonthRange();
  let selectedPreset = 'CUSTOM';
  if (!from && !to) {
    selectedPreset = 'ALL';
  } else if (from === weekRange.from && to === weekRange.to) {
    selectedPreset = 'WEEK';
  } else if (from === monthRange.from && to === monthRange.to) {
    selectedPreset = 'MONTH';
  }

  return (
    <View>
      <CategoryChips chips={PRESETS} selected={selectedPreset} onSelect={selectPreset} />
      <View style={styles.row}>
        <View style={styles.field}>
          <AppInput
            label="Desde"
            value={fromText}
            onChangeText={(text) => apply(text, toText)}
            placeholder="AAAA-MM-DD"
            error={fromError}
            maxLength={10}
          />
        </View>
        <View style={styles.field}>
          <AppInput
            label="Hasta"
            value={toText}
            onChangeText={(text) => apply(fromText, text)}
            placeholder="AAAA-MM-DD"
            error={toError || orderError}
            maxLength={10}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
  },
  field: {
    flex: 1,
    marginRight: spacing.sm,
  },
});

export default DateRangeFilter;
