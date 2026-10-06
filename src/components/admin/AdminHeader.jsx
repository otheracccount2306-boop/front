import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SIDEBAR_MIN_WIDTH } from '../../navigation/tabItems';
import colors from '../../theme/colors';
import { fontSizes, spacing } from '../../theme/typography';
import AppIcon from '../common/AppIcon';
import AdminDrawer from './AdminDrawer';

const AdminHeader = ({ title, subtitle, onBack, rightAction }) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const hasSidebar = Platform.OS === 'web' && width >= SIDEBAR_MIN_WIDTH;

  let leading = null;
  if (onBack) {
    leading = (
      <Pressable onPress={onBack} hitSlop={10} style={styles.side} accessibilityLabel="Volver">
        <AppIcon name="arrow-back" size={24} color={colors.white} />
      </Pressable>
    );
  } else if (!hasSidebar) {
    leading = (
      <Pressable onPress={() => setDrawerVisible(true)} hitSlop={10} style={styles.side} accessibilityLabel="Abrir menú">
        <AppIcon name="menu" size={26} color={colors.white} />
      </Pressable>
    );
  }

  return (
    <View style={[styles.wrapper, { paddingTop: insets.top + spacing.md }]}>
      <View style={styles.row}>
        {leading}
        <View style={styles.titles}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        {rightAction ? <View style={styles.side}>{rightAction}</View> : null}
      </View>
      <AdminDrawer visible={drawerVisible} onClose={() => setDrawerVisible(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 36,
  },
  side: {
    minWidth: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titles: {
    flex: 1,
    marginLeft: spacing.xs,
  },
  title: {
    fontSize: fontSizes.section,
    fontWeight: '700',
    color: colors.white,
  },
  subtitle: {
    fontSize: fontSizes.small,
    color: colors.pale,
    marginTop: 2,
  },
});

export default AdminHeader;
