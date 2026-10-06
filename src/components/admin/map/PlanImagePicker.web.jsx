import React, { useRef, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import colors from '../../../theme/colors';
import { fontSizes, radius, spacing } from '../../../theme/typography';
import AppButton from '../../common/AppButton';
import { preparePlanImage } from './planImage.web';

const PlanImagePicker = ({ value, onChange, error }) => {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleFile = async (event) => {
    const file = event.target.files && event.target.files[0];
    event.target.value = '';
    if (!file) {
      return;
    }
    setBusy(true);
    setLocalError(null);
    try {
      onChange(await preparePlanImage(file));
    } catch (failure) {
      setLocalError(failure.message);
    } finally {
      setBusy(false);
    }
  };

  const message = localError || error;

  return (
    <View style={styles.field}>
      <Text style={styles.label}>
        Imagen del plano <Text style={styles.required}>*</Text>
      </Text>
      <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFile} style={hidden} />
      {value ? (
        <View style={styles.preview}>
          <Image source={{ uri: value.imagen }} style={[styles.image, { aspectRatio: value.ancho / value.alto }]} resizeMode="contain" />
          <Text style={styles.meta}>
            {value.ancho} × {value.alto} px · {Math.round((value.imagen.length * 0.75) / 1024)} KB
          </Text>
        </View>
      ) : (
        <Text style={styles.hint}>Sube el plano como imagen PNG o JPG (por ejemplo, una exportación del plano arquitectónico).</Text>
      )}
      <AppButton
        label={value ? 'Cambiar imagen' : 'Elegir imagen'}
        variant="outline"
        loading={busy}
        onPress={() => inputRef.current && inputRef.current.click()}
      />
      {message ? <Text style={styles.error}>{message}</Text> : null}
    </View>
  );
};

const hidden = { display: 'none' };

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
  required: {
    color: colors.error,
  },
  hint: {
    fontSize: fontSizes.small,
    color: colors.gray2,
    marginBottom: spacing.sm,
  },
  preview: {
    borderWidth: 1,
    borderColor: colors.gray4,
    borderRadius: radius.card,
    backgroundColor: colors.white,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  image: {
    width: '100%',
    maxHeight: 320,
  },
  meta: {
    fontSize: fontSizes.small,
    color: colors.gray2,
    marginTop: spacing.xs,
  },
  error: {
    fontSize: fontSizes.small,
    color: colors.error,
    marginTop: spacing.xs,
  },
});

export default PlanImagePicker;
