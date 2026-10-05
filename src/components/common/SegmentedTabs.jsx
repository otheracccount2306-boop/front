import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import colors from '../../theme/colors';
import { fontSizes, spacing } from '../../theme/typography';

/**
 * @description Pestañas horizontales para moverse entre las pantallas hermanas de un mismo módulo,
 *              por ejemplo Horario y Calendario.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Object} props - Propiedades del componente
 * @param {Array<{ name: string, label: string }>} props.items - Pantallas del módulo
 * @param {string} props.current - Nombre de la pantalla activa
 * @param {Function} props.onChange - Recibe el nombre de la pantalla elegida
 * @returns {React.JSX.Element} Pestañas
 */
const SegmentedTabs = ({ items, current, onChange }) => (
  <View style={styles.row}>
    {items.map((item) => {
      const active = item.name === current;
      return (
        <Pressable
          key={item.name}
          onPress={() => onChange(item.name)}
          style={[styles.item, active ? styles.itemActive : null]}
          accessibilityRole="tab"
          accessibilityState={{ selected: active }}
        >
          <Text style={[styles.label, active ? styles.labelActive : null]}>{item.label}</Text>
        </Pressable>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray4,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 3,
    borderBottomColor: colors.white,
  },
  itemActive: {
    borderBottomColor: colors.aqua,
  },
  label: {
    fontSize: fontSizes.body,
    fontWeight: '600',
    color: colors.gray3,
  },
  labelActive: {
    color: colors.primary,
  },
});

export default SegmentedTabs;
