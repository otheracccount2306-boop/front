import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import colors from '../../../theme/colors';
import { fontSizes, radius, spacing } from '../../../theme/typography';

const PlanImagePicker = ({ value }) => (
  <View style={styles.field}>
    <Text style={styles.label}>Imagen del plano</Text>
    {value ? (
      <Image source={{ uri: value.imagen }} style={[styles.image, { aspectRatio: value.ancho / value.alto }]} resizeMode="contain" />
    ) : null}
    <Text style={styles.hint}>Para subir o cambiar la imagen abre el panel administrativo desde un navegador.</Text>
  </View>
);

const styles = StyleSheet.create({
  field: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSizes.small,
    fontWeight: '700',
    color: colors.gray1,
    marginBottom: spacing.sm,
  },
  image: {
    width: '100%',
    borderRadius: radius.card,
    backgroundColor: colors.white,
    marginBottom: spacing.sm,
  },
  hint: {
    fontSize: fontSizes.small,
    color: colors.gray2,
  },
});

export default PlanImagePicker;
