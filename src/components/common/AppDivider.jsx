import React from 'react';
import { StyleSheet, View } from 'react-native';
import colors from '../../theme/colors';
import { spacing } from '../../theme/typography';

/**
 * @description Línea separadora horizontal.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @returns {React.JSX.Element} Separador
 */
const AppDivider = () => <View style={styles.line} />;

const styles = StyleSheet.create({
  line: {
    height: 1,
    backgroundColor: colors.gray4,
    marginVertical: spacing.md,
  },
});

export default AppDivider;
