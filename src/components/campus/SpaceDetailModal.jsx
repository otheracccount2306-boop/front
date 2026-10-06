import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import colors, { getCategoryColor } from '../../theme/colors';
import { cardShadow, fontSizes, radius, spacing } from '../../theme/typography';
import { categoryLabel } from '../../utils/category.utils';
import AppBadge from '../common/AppBadge';
import AppButton from '../common/AppButton';

const SpaceDetailModal = ({ space, onClose, onShowOnMap }) => (
  <Modal visible={Boolean(space)} transparent animationType="fade" onRequestClose={onClose}>
    <View style={styles.overlay}>
      {space ? (
        <View style={styles.dialog}>
          <View style={[styles.strip, { backgroundColor: getCategoryColor(space.categoria) }]} />
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.name}>{space.nombre}</Text>
            <View style={styles.badges}>
              <AppBadge label={categoryLabel(space.categoria)} variant="success" />
              <Text style={styles.code}>{space.codigo}</Text>
            </View>
            <DetailLine label="Edificio" value={space.edificio} />
            <DetailLine label="Piso" value={space.piso} />
            <DetailLine label="Descripción" value={space.descripcion} />
            <DetailLine label="Cómo llegar" value={space.referencia} />
            {onShowOnMap && space.planoId && space.geometria ? (
              <AppButton label="Ver en el mapa" onPress={() => onShowOnMap(space)} style={styles.close} />
            ) : null}
            <AppButton
              label="Cerrar"
              variant={onShowOnMap && space.planoId && space.geometria ? 'outline' : 'primary'}
              onPress={onClose}
              style={styles.close}
            />
          </ScrollView>
        </View>
      ) : null}
    </View>
  </Modal>
);

const DetailLine = ({ label, value }) =>
  value ? (
    <View style={styles.line}>
      <Text style={styles.lineLabel}>{label}</Text>
      <Text style={styles.lineValue}>{value}</Text>
    </View>
  ) : null;

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
    maxWidth: 440,
    maxHeight: '85%',
    backgroundColor: colors.white,
    borderRadius: radius.card,
    overflow: 'hidden',
    ...cardShadow,
  },
  strip: {
    height: 8,
  },
  content: {
    padding: spacing.xl,
  },
  name: {
    fontSize: fontSizes.section,
    fontWeight: '700',
    color: colors.gray1,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  code: {
    fontSize: fontSizes.small,
    fontWeight: '600',
    color: colors.gray3,
    marginLeft: spacing.md,
  },
  line: {
    marginBottom: spacing.md,
  },
  lineLabel: {
    fontSize: fontSizes.label,
    fontWeight: '700',
    color: colors.gray3,
    textTransform: 'uppercase',
  },
  lineValue: {
    fontSize: fontSizes.body,
    color: colors.gray1,
    marginTop: 2,
  },
  close: {
    marginTop: spacing.md,
  },
});

export default SpaceDetailModal;
