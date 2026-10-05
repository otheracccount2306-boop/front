import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import colors from '../../theme/colors';
import { cardShadow, fontSizes, radius, spacing } from '../../theme/typography';
import { CALENDAR_CATEGORY_OPTIONS, emptyToNull } from '../../utils/admin.utils';
import { isValidDateInput } from '../../utils/validation.utils';
import AppButton from '../common/AppButton';
import ErrorBanner from '../common/ErrorBanner';
import AdminFormField from './AdminFormField';
import AdminFormSelect from './AdminFormSelect';

const EMPTY = { nombre: '', descripcion: '', categoria: '', fechaInicio: '', fechaFin: '' };

/**
 * @description Modal de creación y edición de un evento del calendario académico. Valida los campos
 *              en el dispositivo (fechas reales y fecha fin no anterior a la de inicio) y delega el
 *              guardado en la pantalla que lo abre.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.visible - Muestra u oculta el modal
 * @param {Object|null} props.event - Evento a editar, o null para crear uno nuevo
 * @param {Function} props.onClose - Se ejecuta al cancelar o cerrar
 * @param {Function} props.onSubmit - Recibe los datos y devuelve una promesa; debe lanzar el mensaje de error si falla
 * @returns {React.JSX.Element} Modal del formulario
 */
const CalendarEventModal = ({ visible, event, onClose, onSubmit }) => {
  const [values, setValues] = useState(EMPTY);
  const [touched, setTouched] = useState({});
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    if (visible) {
      setValues(
        event
          ? {
              nombre: event.nombre,
              descripcion: event.descripcion || '',
              categoria: event.categoria,
              fechaInicio: event.fechaInicio,
              fechaFin: event.fechaFin || '',
            }
          : EMPTY,
      );
      setTouched({});
      setApiError(null);
    }
  }, [visible, event]);

  const errors = {};
  if (!values.nombre.trim()) {
    errors.nombre = 'Ingresa el nombre del evento';
  }
  if (!values.categoria) {
    errors.categoria = 'Elige una categoría';
  }
  if (!isValidDateInput(values.fechaInicio)) {
    errors.fechaInicio = 'Usa el formato AAAA-MM-DD';
  }
  if (values.fechaFin && !isValidDateInput(values.fechaFin)) {
    errors.fechaFin = 'Usa el formato AAAA-MM-DD';
  } else if (values.fechaFin && !errors.fechaInicio && values.fechaFin < values.fechaInicio) {
    errors.fechaFin = 'La fecha fin no puede ser anterior al inicio';
  }
  const valid = Object.keys(errors).length === 0;

  const setField = (field) => (text) => setValues((previous) => ({ ...previous, [field]: text }));
  const blur = (field) => () => setTouched((previous) => ({ ...previous, [field]: true }));
  const shown = (field) => (touched[field] ? errors[field] : undefined);

  const submit = async () => {
    setSaving(true);
    setApiError(null);
    try {
      await onSubmit({
        nombre: values.nombre.trim(),
        descripcion: emptyToNull(values.descripcion),
        categoria: values.categoria,
        fechaInicio: values.fechaInicio,
        fechaFin: emptyToNull(values.fechaFin),
      });
    } catch (error) {
      setApiError(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>{event ? 'Editar evento del calendario' : 'Nuevo evento del calendario'}</Text>
          <ScrollView keyboardShouldPersistTaps="handled">
            <ErrorBanner message={apiError} />
            <AdminFormField
              label="Nombre"
              required
              value={values.nombre}
              onChangeText={setField('nombre')}
              onBlur={blur('nombre')}
              error={shown('nombre')}
              maxLength={200}
            />
            <AdminFormField
              label="Descripción"
              value={values.descripcion}
              onChangeText={setField('descripcion')}
              multiline
            />
            <AdminFormSelect
              label="Categoría"
              required
              value={values.categoria}
              onChange={(value) => {
                setField('categoria')(value);
                blur('categoria')();
              }}
              options={CALENDAR_CATEGORY_OPTIONS}
              error={shown('categoria')}
            />
            <AdminFormField
              label="Fecha de inicio"
              required
              value={values.fechaInicio}
              onChangeText={setField('fechaInicio')}
              onBlur={blur('fechaInicio')}
              error={shown('fechaInicio')}
              placeholder="AAAA-MM-DD"
              maxLength={10}
              autoCapitalize="none"
            />
            <AdminFormField
              label="Fecha de fin"
              value={values.fechaFin}
              onChangeText={setField('fechaFin')}
              onBlur={blur('fechaFin')}
              error={shown('fechaFin')}
              placeholder="AAAA-MM-DD (opcional)"
              maxLength={10}
              autoCapitalize="none"
            />
          </ScrollView>
          <View style={styles.actions}>
            <AppButton label="Cancelar" variant="outline" onPress={onClose} style={styles.action} />
            <AppButton label="Guardar" onPress={submit} disabled={!valid} loading={saving} style={styles.action} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

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
    maxWidth: 480,
    maxHeight: '90%',
    backgroundColor: colors.white,
    borderRadius: radius.card,
    padding: spacing.xl,
    ...cardShadow,
  },
  title: {
    fontSize: fontSizes.section,
    fontWeight: '700',
    color: colors.gray1,
    marginBottom: spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    marginTop: spacing.md,
  },
  action: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
});

export default CalendarEventModal;
