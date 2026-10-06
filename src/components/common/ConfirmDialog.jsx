import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import colors from '../../theme/colors';
import { cardShadow, fontSizes, radius, spacing } from '../../theme/typography';
import AppButton from './AppButton';

const ConfirmDialog = ({
  visible,
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
  loading = false,
  confirmDisabled = false,
  children,
}) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
    <View style={styles.overlay}>
      <View style={styles.dialog}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        {children}
        <View style={styles.actions}>
          <AppButton label="Cancelar" variant="outline" onPress={onCancel} style={styles.action} />
          <AppButton
            label={confirmLabel}
            variant="danger"
            onPress={onConfirm}
            loading={loading}
            disabled={confirmDisabled}
            style={styles.action}
          />
        </View>
      </View>
    </View>
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
  dialog: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.white,
    borderRadius: radius.card,
    padding: spacing.xl,
    ...cardShadow,
  },
  title: {
    fontSize: fontSizes.section,
    fontWeight: '700',
    color: colors.gray1,
  },
  message: {
    fontSize: fontSizes.body,
    color: colors.gray2,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  actions: {
    flexDirection: 'row',
  },
  action: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
});

export default ConfirmDialog;
