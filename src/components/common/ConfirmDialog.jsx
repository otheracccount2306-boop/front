import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import colors from '../../theme/colors';
import { cardShadow, fontSizes, radius, spacing } from '../../theme/typography';
import AppButton from './AppButton';

/**
 * @description Diálogo de confirmación propio. Reemplaza a Alert.alert, que no funciona en la
 *              versión web de React Native.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.visible - Muestra u oculta el diálogo
 * @param {string} props.title - Título del diálogo
 * @param {string} props.message - Texto explicativo
 * @param {string} props.confirmLabel - Texto del botón de confirmación
 * @param {Function} props.onConfirm - Se ejecuta al confirmar
 * @param {Function} props.onCancel - Se ejecuta al cancelar
 * @param {boolean} [props.loading] - Muestra carga en el botón de confirmación
 * @returns {React.JSX.Element} Diálogo modal
 */
const ConfirmDialog = ({ visible, title, message, confirmLabel, onConfirm, onCancel, loading = false }) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
    <View style={styles.overlay}>
      <View style={styles.dialog}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        <View style={styles.actions}>
          <AppButton label="Cancelar" variant="outline" onPress={onCancel} style={styles.action} />
          <AppButton
            label={confirmLabel}
            variant="danger"
            onPress={onConfirm}
            loading={loading}
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
