import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '../../theme/colors';
import { fontSizes, spacing } from '../../theme/typography';
import { getPasswordChecks, getPasswordStrength } from '../../utils/validation.utils';

const LEVEL_COLORS = { weak: colors.error, medium: colors.accent, strong: colors.success };

const REQUIREMENTS = [
  { key: 'length', label: '8 o más caracteres' },
  { key: 'upper', label: 'Una mayúscula' },
  { key: 'number', label: 'Un número' },
  { key: 'special', label: 'Un carácter especial' },
];

/**
 * @description Indicador de fortaleza de la contraseña: barra de cuatro segmentos y lista de
 *              requisitos cumplidos.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @param {Object} props - Propiedades del componente
 * @param {string} props.password - Contraseña escrita por el usuario
 * @returns {React.JSX.Element|null} Indicador, o null si no hay contraseña
 */
const PasswordStrength = ({ password }) => {
  if (!password) {
    return null;
  }
  const strength = getPasswordStrength(password);
  const checks = getPasswordChecks(password);
  const barColor = LEVEL_COLORS[strength.level];

  return (
    <View style={styles.container}>
      <View style={styles.bars}>
        {[1, 2, 3, 4].map((segment) => (
          <View
            key={segment}
            style={[styles.bar, { backgroundColor: segment <= strength.score ? barColor : colors.gray4 }]}
          />
        ))}
      </View>
      <Text style={[styles.level, { color: barColor }]}>Contraseña {strength.label.toLowerCase()}</Text>
      {REQUIREMENTS.map((requirement) => (
        <Text
          key={requirement.key}
          style={[styles.requirement, { color: checks[requirement.key] ? colors.success : colors.gray3 }]}
        >
          {checks[requirement.key] ? '✓' : '•'} {requirement.label}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: -spacing.xs,
    marginBottom: spacing.md,
  },
  bars: {
    flexDirection: 'row',
  },
  bar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    marginRight: spacing.xs,
  },
  level: {
    fontSize: fontSizes.small,
    fontWeight: '700',
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  requirement: {
    fontSize: fontSizes.small,
  },
});

export default PasswordStrength;
