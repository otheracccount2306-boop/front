import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ADMIN_MENU } from '../../navigation/adminMenu';
import colors from '../../theme/colors';
import { fontSizes, radius, spacing } from '../../theme/typography';
import AppIcon from '../common/AppIcon';

const AdminMenu = ({ active, onSelect, onLogout }) => (
  <View style={styles.container}>
    <View>
      <Text style={styles.brand}>UCC Administración</Text>
      <Text style={styles.campus}>Campus Santa Marta</Text>
      {ADMIN_MENU.map((item) => {
        const focused = item.name === active;
        return (
          <Pressable
            key={item.name}
            onPress={() => onSelect(item)}
            style={[styles.item, focused ? styles.itemActive : null]}
            accessibilityRole="button"
            accessibilityState={{ selected: focused }}
          >
            <AppIcon name={item.icon} size={20} color={colors.white} />
            <Text style={styles.label}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
    <Pressable onPress={onLogout} style={styles.item} accessibilityRole="button">
      <AppIcon name="log-out-outline" size={20} color={colors.white} />
      <Text style={styles.label}>Cerrar sesión</Text>
    </Pressable>
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
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.card,
    marginBottom: spacing.xs,
  },
  itemActive: {
    backgroundColor: colors.aqua,
  },
  label: {
    fontSize: fontSizes.body,
    fontWeight: '600',
    color: colors.white,
    marginLeft: spacing.md,
  },
});

export default AdminMenu;
