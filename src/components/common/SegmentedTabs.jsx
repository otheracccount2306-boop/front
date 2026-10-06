import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import colors from '../../theme/colors';
import { fontSizes, spacing } from '../../theme/typography';

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
