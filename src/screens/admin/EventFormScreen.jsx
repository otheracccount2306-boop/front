import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { createEvent, updateEvent } from '../../api/admin.api';
import AdminFormField from '../../components/admin/AdminFormField';
import AdminFormSelect from '../../components/admin/AdminFormSelect';
import AdminHeader from '../../components/admin/AdminHeader';
import AppButton from '../../components/common/AppButton';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ErrorBanner from '../../components/common/ErrorBanner';
import ScreenContainer from '../../components/common/ScreenContainer';
import useUnsavedGuard from '../../hooks/useUnsavedGuard';
import { spacing } from '../../theme/typography';
import {
  EVENT_CATEGORY_OPTIONS,
  emptyToNull,
  getAdminErrorMessage,
  isTodayOrFuture,
  isValidTimeInput,
  joinDateTime,
  splitDateTime,
} from '../../utils/admin.utils';
import { isValidDateInput } from '../../utils/validation.utils';

const EMPTY = {
  nombre: '',
  descripcion: '',
  categoria: '',
  lugar: '',
  fecha: '',
  hora: '',
  cupos: '',
  estado: 'ACTIVO',
};

const toFormValues = (event) => {
  if (!event) {
    return EMPTY;
  }
  const { date, time } = splitDateTime(event.fechaHora);
  return {
    nombre: event.nombre,
    descripcion: event.descripcion || '',
    categoria: event.categoria,
    lugar: event.lugar || '',
    fecha: date,
    hora: time,
    cupos: event.cupos === null || event.cupos === undefined ? '' : String(event.cupos),
    estado: event.estado === 'CANCELADO' ? 'CANCELADO' : 'ACTIVO',
  };
};

const EventFormScreen = ({ navigation, route }) => {
  const event = route.params ? route.params.event : undefined;
  const initial = useMemo(() => toFormValues(event), [event]);
  const [values, setValues] = useState(initial);
  const [touched, setTouched] = useState({});
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState(null);
  const guard = useUnsavedGuard(navigation, JSON.stringify(values) !== JSON.stringify(initial));

  const errors = {};
  if (!values.nombre.trim()) {
    errors.nombre = 'Ingresa el nombre del evento';
  }
  if (!values.categoria) {
    errors.categoria = 'Elige una categoría';
  }
  if (!values.lugar.trim()) {
    errors.lugar = 'Ingresa el lugar';
  }
  if (!isValidDateInput(values.fecha)) {
    errors.fecha = 'Usa el formato AAAA-MM-DD';
  } else if (values.estado === 'ACTIVO' && !isTodayOrFuture(values.fecha)) {
    errors.fecha = 'La fecha debe ser hoy o posterior';
  }
  if (!isValidTimeInput(values.hora)) {
    errors.hora = 'Usa el formato HH:mm (24 horas)';
  }
  if (values.cupos && !/^\d+$/.test(values.cupos)) {
    errors.cupos = 'Ingresa un número entero';
  }
  const valid = Object.keys(errors).length === 0;

  const setField = (field) => (text) => setValues((previous) => ({ ...previous, [field]: text }));
  const blur = (field) => () => setTouched((previous) => ({ ...previous, [field]: true }));
  const shown = (field) => (touched[field] ? errors[field] : undefined);

  const save = async () => {
    setSaving(true);
    setApiError(null);
    const body = {
      nombre: values.nombre.trim(),
      descripcion: emptyToNull(values.descripcion),
      categoria: values.categoria,
      lugar: values.lugar.trim(),
      fechaHora: joinDateTime(values.fecha, values.hora),
      cupos: values.cupos ? Number(values.cupos) : null,
      estado: values.estado,
    };
    try {
      if (event) {
        await updateEvent(event.id, body);
      } else {
        await createEvent(body);
      }
      guard.allowExit();
      navigation.navigate('EventsManagement', {
        flash: event ? 'Evento actualizado correctamente.' : 'Evento creado correctamente.',
      });
    } catch (error) {
      setApiError(getAdminErrorMessage(error, { 409: 'Un evento concluido no puede modificarse' }));
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenContainer
      header={<AdminHeader title={event ? 'Editar evento' : 'Nuevo evento'} onBack={() => navigation.goBack()} />}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <ErrorBanner message={apiError} />
        <AdminFormField
          label="Nombre"
          required
          value={values.nombre}
          onChangeText={setField('nombre')}
          onBlur={blur('nombre')}
          error={shown('nombre')}
          maxLength={200}
          showCount
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
          options={EVENT_CATEGORY_OPTIONS}
          error={shown('categoria')}
        />
        <AdminFormField
          label="Lugar"
          required
          value={values.lugar}
          onChangeText={setField('lugar')}
          onBlur={blur('lugar')}
          error={shown('lugar')}
          maxLength={200}
        />
        <AdminFormField
          label="Fecha"
          required
          value={values.fecha}
          onChangeText={setField('fecha')}
          onBlur={blur('fecha')}
          error={shown('fecha')}
          placeholder="AAAA-MM-DD"
          maxLength={10}
          autoCapitalize="none"
        />
        <AdminFormField
          label="Hora"
          required
          value={values.hora}
          onChangeText={setField('hora')}
          onBlur={blur('hora')}
          error={shown('hora')}
          placeholder="HH:mm"
          maxLength={5}
          autoCapitalize="none"
        />
        <AdminFormField
          label="Cupos"
          value={values.cupos}
          onChangeText={setField('cupos')}
          onBlur={blur('cupos')}
          error={shown('cupos')}
          keyboardType="numeric"
          maxLength={6}
        />
        <AdminFormSelect
          label="Estado"
          value={values.estado}
          onChange={setField('estado')}
          options={[
            { value: 'ACTIVO', label: 'Activo' },
            { value: 'CANCELADO', label: 'Cancelado' },
          ]}
        />
        <View style={styles.actions}>
          <AppButton label="Cancelar" variant="outline" onPress={() => navigation.goBack()} style={styles.action} />
          <AppButton label="Guardar" onPress={save} disabled={!valid} loading={saving} style={styles.action} />
        </View>
      </ScrollView>
      <ConfirmDialog
        visible={guard.visible}
        title="Cambios sin guardar"
        message="Si sales ahora perderás los cambios de este formulario."
        confirmLabel="Salir sin guardar"
        onCancel={guard.cancelExit}
        onConfirm={guard.confirmExit}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  actions: {
    flexDirection: 'row',
    marginTop: spacing.md,
  },
  action: {
    flex: 1,
    margin: spacing.xs,
  },
});

export default EventFormScreen;
