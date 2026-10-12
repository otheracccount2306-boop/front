import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../../theme/colors';
import { useLayout } from '../../theme/layout';
import { fontSizes, spacing } from '../../theme/typography';
import StudentDrawer from '../navigation/StudentDrawer';
import AppIcon from './AppIcon';

const ScreenHeader = ({ title, subtitle, onBack, right }) => {
  const insets = useSafeAreaInsets();
  const layout = useLayout();
  const rowWidth = { maxWidth: layout.contentMaxWidth || '100%', paddingHorizontal: layout.bodyPadding };
  const [menuVisible, setMenuVisible] = useState(false);
  const showMenuButton = !onBack && !layout.sidebar;

  return (
    <View style={[styles.wrapper, { paddingTop: insets.top + spacing.md }]}>
      <View style={[styles.row, rowWidth]}>
        {onBack ? (
          <Pressable onPress={onBack} hitSlop={10} style={styles.side} accessibilityLabel="Volver">
            <AppIcon name="arrow-back" size={24} color={colors.white} />
          </Pressable>
        ) : null}
        {showMenuButton ? (
          <Pressable
            onPress={() => setMenuVisible(true)}
            hitSlop={10}
            style={[styles.side, styles.menuButton]}
            accessibilityLabel="Abrir menú"
            testID="abrir-menu"
          >
            <AppIcon name="menu" size={26} color={colors.white} />
          </Pressable>
        ) : null}
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
        {right ? <View style={styles.side}>{right}</View> : null}
      </View>
      {showMenuButton ? <StudentDrawer visible={menuVisible} onClose={() => setMenuVisible(false)} /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 36,
    width: '100%',
    alignSelf: 'center',
  },
  side: {
    minWidth: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuButton: {
    marginRight: spacing.sm,
  },
  titles: {
    flex: 1,
    minWidth: 0,
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

export default ScreenHeader;
