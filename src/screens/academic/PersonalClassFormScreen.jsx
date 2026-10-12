import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { createPersonalClass, deletePersonalClass, getSchedule, updatePersonalClass } from '../../api/academic.api';
import AppButton from '../../components/common/AppButton';
import AppInput from '../../components/common/AppInput';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import DaysSelector from '../../components/common/DaysSelector';
import ErrorBanner from '../../components/common/ErrorBanner';
import ScreenContainer from '../../components/common/ScreenContainer';
import ScreenHeader from '../../components/common/ScreenHeader';
import useUnsavedGuard from '../../hooks/useUnsavedGuard';
import useCacheStore from '../../store/cache.store';
import colors from '../../theme/colors';
import { useLayout } from '../../theme/layout';
import { fontSizes, spacing } from '../../theme/typography';
import { extractServerMessage, getErrorMessage } from '../../utils/error.utils';
import {
  maskTime,
  personalClassValues,
  toPersonalClassPayload,
  validatePersonalClass,
} from '../../utils/personalClass.utils';

/** Mensajes para errores del servidor. */
const ERROR_OVERRIDES = {
  404: 'Esta clase ya no existe. Vuelve al horario.',
};

/**
 * @description Mensaje para el estudiante: un 409 trae el nombre de la clase con la que se cruza.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {Object} error - Error de Axios
 * @returns {string} Mensaje
 */
const saveErrorMessage = (error) =>
  (error && error.response && error.response.status === 409 && extractServerMessage(error)) ||
  getErrorMessage(error, ERROR_OVERRIDES);

/**
 * @description Actualiza la copia local del horario después de guardar, para que la clase aparezca
 *              también sin conexión. Si no se puede volver a consultar el horario, se ajusta la
 *              copia con la respuesta recibida.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {Function} change - Recibe la lista actual y devuelve la nueva (respaldo sin conexión)
 * @returns {Promise<void>} Promesa resuelta al actualizar la caché
 */
const refreshScheduleCache = async (change) => {
  const store = useCacheStore.getState();
  try {
    store.setSchedule(await getSchedule());
  } catch {
    store.setSchedule(change(store.schedule || []));
  }
};

/**
 * @description Formulario para que el estudiante registre o edite una clase de su horario: nombre,
 *              docente, aula, días y horas. La clase queda solo en su cuenta (el servidor toma el
 *              dueño de la sesión) y aparece en el horario y en "Próxima clase hoy". Si el aula
 *              coincide con un espacio del mapa, la clase muestra "Ver en mapa". Guardar requiere
 *              conexión; el horario guardado se sigue viendo sin internet.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {Object} props - Props de navegación de React Navigation
 * @param {Object} props.navigation - Objeto de navegación
 * @param {Object} props.route - route.params.subject = clase a editar; route.params.day = día inicial
 * @returns {React.JSX.Element} Formulario de clase personal
 */
const PersonalClassFormScreen = ({ navigation, route }) => {
  const params = route.params || {};
  const subject = params.subject || null;
  const editing = Boolean(subject);
  const initial = useMemo(() => personalClassValues(subject, params.day), [subject, params.day]);
  const [values, setValues] = useState(initial);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const guard = useUnsavedGuard(navigation, JSON.stringify(values) !== JSON.stringify(initial));
  const { isCompact } = useLayout();

  const errors = validatePersonalClass(values);
  const shown = (field) => (submitted || touched[field] ? errors[field] : undefined);
  const setField = (field, transform) => (text) =>
    setValues((previous) => ({ ...previous, [field]: transform ? transform(text) : text }));
  const blur = (field) => () => setTouched((previous) => ({ ...previous, [field]: true }));

  const finish = () => {
    guard.allowExit();
    navigation.goBack();
  };

  const save = async () => {
    setSubmitted(true);
    if (Object.keys(errors).length > 0) {
      return;
    }
    setSaving(true);
    setApiError(null);
    try {
      const payload = toPersonalClassPayload(values);
      const saved = editing ? await updatePersonalClass(subject.id, payload) : await createPersonalClass(payload);
      await refreshScheduleCache((list) => [...list.filter((item) => item.id !== saved.id), saved]);
      finish();
    } catch (error) {
      setApiError(saveErrorMessage(error));
      setSaving(false);
    }
  };

  const remove = async () => {
    setConfirmDelete(false);
    setSaving(true);
    setApiError(null);
    try {
      await deletePersonalClass(subject.id);
      await refreshScheduleCache((list) => list.filter((item) => item.id !== subject.id));
      finish();
    } catch (error) {
      setApiError(saveErrorMessage(error));
      setSaving(false);
    }
  };

  return (
    <ScreenContainer
      header={
        <ScreenHeader
          title={editing ? 'Editar clase' : 'Agregar clase'}
          subtitle="Solo tú ves las clases que registras"
          onBack={() => navigation.goBack()}
        />
      }
    >
      <KeyboardAvoidingView style={styles.fill} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={[styles.content, !isCompact && styles.contentWide]}
          keyboardShouldPersistTaps="handled"
        >
          <ErrorBanner message={apiError} />
          <AppInput
            label="Nombre de la clase *"
            value={values.nombre}
            onChangeText={setField('nombre')}
            onBlur={blur('nombre')}
            error={shown('nombre')}
            placeholder="Por ejemplo Inglés III"
            autoCapitalize="sentences"
            maxLength={150}
            testID="clase-nombre"
          />
          <AppInput
            label="Docente"
            value={values.docente}
            onChangeText={setField('docente')}
            onBlur={blur('docente')}
            error={shown('docente')}
            placeholder="Opcional"
            autoCapitalize="words"
            maxLength={150}
          />
          <AppInput
            label="Aula"
            value={values.aula}
            onChangeText={setField('aula')}
            onBlur={blur('aula')}
            error={shown('aula')}
            placeholder="Por ejemplo Aula 2 101 o AU-2-101"
            autoCapitalize="none"
            maxLength={50}
            testID="clase-aula"
          />
          <Text style={styles.hint}>Si escribes el nombre o el código del salón, podrás verlo en el mapa.</Text>
          <DaysSelector
            value={values.dias}
            onChange={(dias) => {
              setValues((previous) => ({ ...previous, dias }));
              blur('dias')();
            }}
            error={shown('dias')}
          />
          <View style={styles.row}>
            <View style={styles.half}>
              <AppInput
                label="Hora de inicio *"
                value={values.horaInicio}
                onChangeText={setField('horaInicio', maskTime)}
                onBlur={blur('horaInicio')}
                error={shown('horaInicio')}
                placeholder="07:00"
                keyboardType="number-pad"
                maxLength={5}
                testID="clase-inicio"
              />
            </View>
            <View style={styles.half}>
              <AppInput
                label="Hora de fin *"
                value={values.horaFin}
                onChangeText={setField('horaFin', maskTime)}
                onBlur={blur('horaFin')}
                error={shown('horaFin')}
                placeholder="09:00"
                keyboardType="number-pad"
                maxLength={5}
                testID="clase-fin"
              />
            </View>
          </View>
          <AppButton label={editing ? 'Guardar cambios' : 'Agregar al horario'} onPress={save} loading={saving} />
          {editing ? (
            <AppButton
              label="Eliminar clase"
              variant="outline"
              onPress={() => setConfirmDelete(true)}
              disabled={saving}
              style={styles.secondary}
            />
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
      <ConfirmDialog
        visible={confirmDelete}
        title="Eliminar clase"
        message={subject ? `"${subject.nombre}" se quitará de tu horario.` : ''}
        confirmLabel="Eliminar"
        onCancel={() => setConfirmDelete(false)}
        onConfirm={remove}
      />
      <ConfirmDialog
        visible={guard.visible}
        title="Cambios sin guardar"
        message="Si sales ahora, perderás los cambios de esta clase."
        confirmLabel="Salir sin guardar"
        onCancel={guard.cancelExit}
        onConfirm={guard.confirmExit}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  contentWide: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
  },
  hint: {
    fontSize: fontSizes.small,
    color: colors.gray2,
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    marginHorizontal: -spacing.xs,
  },
  half: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: spacing.xs,
  },
  secondary: {
    marginTop: spacing.md,
  },
});

export default PersonalClassFormScreen;
