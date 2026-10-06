import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import colors from '../../theme/colors';
import { cardShadow, fontSizes, radius, spacing } from '../../theme/typography';

const ActionMenu = ({ actions, visible, onClose, title }) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <Pressable style={styles.overlay} onPress={onClose} accessibilityLabel="Cerrar menú">
      <View style={styles.sheet}>
        {title ? <Text style={styles.title}>{title}</Text> : null}
        {actions.map((action) => (
          <Pressable
            key={action.label}
            style={styles.item}
            accessibilityRole="button"
            onPress={() => {
              onClose();
              action.onPress();
            }}
          >
            <Text style={[styles.label, action.variant === 'danger' ? styles.danger : null]}>{action.label}</Text>
          </Pressable>
        ))}
        <Pressable style={[styles.item, styles.cancel]} onPress={onClose} accessibilityRole="button">
          <Text style={styles.cancelLabel}>Cancelar</Text>
        </Pressable>
      </View>
    </Pressable>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  sheet: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.white,
    borderRadius: radius.card,
    paddingVertical: spacing.sm,
    ...cardShadow,
  },
  title: {
    fontSize: fontSizes.small,
    fontWeight: '700',
    color: colors.gray3,
    textTransform: 'uppercase',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  item: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  label: {
    fontSize: fontSizes.body,
    fontWeight: '600',
    color: colors.gray1,
  },
  danger: {
    color: colors.error,
  },
  cancel: {
    borderTopWidth: 1,
    borderTopColor: colors.gray4,
    marginTop: spacing.xs,
  },
  cancelLabel: {
    fontSize: fontSizes.body,
    color: colors.gray2,
  },
});

export default ActionMenu;
