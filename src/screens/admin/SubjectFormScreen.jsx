import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { createSubject, updateSubject } from '../../api/admin.api';
import AdminFormField from '../../components/admin/AdminFormField';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminSwitch from '../../components/admin/AdminSwitch';
import DaysSelector from '../../components/admin/DaysSelector';
import AppButton from '../../components/common/AppButton';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ErrorBanner from '../../components/common/ErrorBanner';
import ScreenContainer from '../../components/common/ScreenContainer';
import useUnsavedGuard from '../../hooks/useUnsavedGuard';
import colors from '../../theme/colors';
import { fontSizes, spacing } from '../../theme/typography';
import {
  emptyToNull,
  getAdminErrorMessage,
  getSubjectConflictMessage,
  isValidTimeInput,
} from '../../utils/admin.utils';
import { formatTime } from '../../utils/date.utils';

const EMPTY = {
  nombre: '',
  codigo: '',
  docente: '',
  aula: '',
  dias: [],
  horaInicio: '',
  horaFin: '',
  periodoAcademico: '',
  activo: true,
};

const toFormValues = (subject) =>
  subject
    ? {
        nombre: subject.nombre,
        codigo: subject.codigo,
        docente: subject.docente || '',
        aula: subject.aula || '',
        dias: subject.dias,
        horaInicio: formatTime(subject.horaInicio),
        horaFin: formatTime(subject.horaFin),
        periodoAcademico: subject.periodoAcademico,
        activo: subject.activo,
      }
    : EMPTY;

const SubjectFormScreen = ({ navigation, route }) => {
  const subject = route.params ? route.params.subject : undefined;
  const initial = useMemo(() => toFormValues(subject), [subject]);
  const [values, setValues] = useState(initial);
  const [touched, setTouched] = useState({});
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState(null);
  const guard = useUnsavedGuard(navigation, JSON.stringify(values) !== JSON.stringify(initial));

  const errors = {};
  if (!values.nombre.trim()) {
    errors.nombre = 'Ingresa el nombre de la asignatura';
  }
  if (!values.codigo.trim()) {
    errors.codigo = 'Ingresa el código de la asignatura';
  }
  if (values.dias.length === 0) {
    errors.dias = 'Elige al menos un día';
  }
  if (!isValidTimeInput(values.horaInicio)) {
    errors.horaInicio = 'Usa el formato HH:mm (24 horas)';
  }
  if (!isValidTimeInput(values.horaFin)) {
    errors.horaFin = 'Usa el formato HH:mm (24 horas)';
  } else if (!errors.horaInicio && values.horaFin <= values.horaInicio) {
    errors.horaFin = 'La hora de fin debe ser posterior a la de inicio';
  }
  if (!values.periodoAcademico.trim()) {
    errors.periodoAcademico = 'Ingresa el periodo académico';
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
      codigo: values.codigo.trim(),
      docente: emptyToNull(values.docente),
      aula: emptyToNull(values.aula),
      dias: values.dias,
      horaInicio: values.horaInicio,
      horaFin: values.horaFin,
      periodoAcademico: values.periodoAcademico.trim(),
      activo: values.activo,
    };
    try {
      if (subject) {
        await updateSubject(subject.id, body);
      } else {
        await createSubject(body);
      }
      guard.allowExit();
      navigation.navigate('SubjectsManagement', {
        flash: subject ? 'Asignatura actualizada correctamente.' : 'Asignatura creada correctamente.',
      });
    } catch (error) {
      setApiError(getSubjectConflictMessage(error) || getAdminErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenContainer
      header={
        <AdminHeader title={subject ? 'Editar asignatura' : 'Nueva asignatura'} onBack={() => navigation.goBack()} />
      }
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
          maxLength={150}
        />
        <AdminFormField
          label="Código"
          required
          value={values.codigo}
          onChangeText={(text) => setField('codigo')(text.toUpperCase())}
          onBlur={blur('codigo')}
          error={shown('codigo')}
          placeholder="Por ejemplo ISW-201"
          autoCapitalize="characters"
          maxLength={30}
        />
        <AdminFormField label="Docente" value={values.docente} onChangeText={setField('docente')} maxLength={150} />
        <AdminFormField
          label="Aula"
          value={values.aula}
          onChangeText={setField('aula')}
          placeholder="Código o nombre del espacio, por ejemplo AU-2-101 o Aula 2 101"
          maxLength={50}
        />
        <Text style={styles.hint}>
          Si coincide con un espacio ubicado en el mapa del campus, los estudiantes verán el botón "Ver en mapa" en su
          horario.
        </Text>
        <DaysSelector
          value={values.dias}
          onChange={(dias) => {
            setValues((previous) => ({ ...previous, dias }));
            blur('dias')();
          }}
          error={shown('dias')}
        />
        <AdminFormField
          label="Hora de inicio"
          required
          value={values.horaInicio}
          onChangeText={setField('horaInicio')}
          onBlur={blur('horaInicio')}
          error={shown('horaInicio')}
          placeholder="HH:mm"
          maxLength={5}
          autoCapitalize="none"
        />
        <AdminFormField
          label="Hora de fin"
          required
          value={values.horaFin}
          onChangeText={setField('horaFin')}
          onBlur={blur('horaFin')}
          error={shown('horaFin')}
          placeholder="HH:mm"
          maxLength={5}
          autoCapitalize="none"
        />
        <AdminFormField
          label="Periodo académico"
          required
          value={values.periodoAcademico}
          onChangeText={setField('periodoAcademico')}
          onBlur={blur('periodoAcademico')}
          error={shown('periodoAcademico')}
          placeholder="Por ejemplo 2026-1"
          autoCapitalize="none"
          maxLength={20}
        />
        <AdminSwitch
          label="Activa"
          hint="Si está apagada, no aparece en los horarios de los estudiantes"
          value={values.activo}
          onChange={(value) => setValues((previous) => ({ ...previous, activo: value }))}
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
  hint: {
    color: colors.gray2,
    fontSize: fontSizes.small,
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
  },
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

export default SubjectFormScreen;
