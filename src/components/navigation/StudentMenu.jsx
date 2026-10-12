import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PROFILE_ITEM, TAB_ITEMS } from '../../navigation/tabItems';
import colors from '../../theme/colors';
import { fontSizes, radius, spacing } from '../../theme/typography';
import AppIcon from '../common/AppIcon';

const MenuItem = ({ item, focused, onPress }) => (
  <Pressable
    onPress={onPress}
    style={[styles.item, focused ? styles.itemActive : null]}
    accessibilityRole="button"
    accessibilityState={{ selected: focused }}
    testID={`menu-${item.root || item.name}`}
  >
    <AppIcon name={item.icon} size={20} color={focused ? colors.white : colors.pale} />
    <Text style={[styles.label, focused ? styles.labelActive : null]}>{item.label}</Text>
  </Pressable>
);

const StudentMenu = ({ active, onSelect, onLogout }) => (
  <View style={styles.container}>
    <View>
      <Text style={styles.brand}>UCC Orientación</Text>
      <Text style={styles.campus}>Campus Santa Marta</Text>
      {TAB_ITEMS.map((item) => (
        <MenuItem key={item.name} item={item} focused={item.name === active} onPress={() => onSelect(item)} />
      ))}
    </View>
    <View style={styles.footer}>
      <MenuItem item={PROFILE_ITEM} focused={active === 'Profile'} onPress={() => onSelect(PROFILE_ITEM)} />
      <MenuItem
        item={{ name: 'logout', label: 'Cerrar sesión', icon: 'log-out-outline' }}
        focused={false}
        onPress={onLogout}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  brand: {
    fontSize: fontSizes.section,
    fontWeight: '700',
    color: colors.white,
    paddingHorizontal: spacing.sm,
  },
  campus: {
    fontSize: fontSizes.small,
    color: colors.light,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.xl,
  },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.light,
    paddingTop: spacing.sm,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.card,
    marginBottom: spacing.xs,
  },
  itemActive: {
    backgroundColor: colors.primary,
  },
  label: {
    fontSize: fontSizes.body,
    fontWeight: '600',
    color: colors.pale,
    marginLeft: spacing.md,
  },
  labelActive: {
    color: colors.white,
  },
});

export default StudentMenu;
