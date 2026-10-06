import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import AppIcon from '../components/common/AppIcon';
import colors from '../theme/colors';
import { fontSizes, spacing } from '../theme/typography';
import { SIDEBAR_WIDTH, TAB_ITEMS } from './tabItems';

const WebSidebar = ({ state, navigation }) => (
  <View style={styles.sidebar}>
    <Text style={styles.brand}>UCC Orientación</Text>
    <Text style={styles.campus}>Campus Santa Marta</Text>
    {TAB_ITEMS.map((item, index) => {
      const focused = state.index === index;
      return (
        <Pressable
          key={item.name}
          onPress={() => navigation.navigate(item.name)}
          style={[styles.item, focused ? styles.itemActive : null]}
          accessibilityRole="button"
          accessibilityState={{ selected: focused }}
        >
          <AppIcon name={item.icon} size={20} color={focused ? colors.white : colors.pale} />
          <Text style={[styles.label, focused ? styles.labelActive : null]}>{item.label}</Text>
        </Pressable>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: colors.primaryDark,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.md,
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
    borderRadius: 8,
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

export default WebSidebar;
