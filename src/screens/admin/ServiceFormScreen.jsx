import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { createService, updateService } from '../../api/admin.api';
import AdminFormField from '../../components/admin/AdminFormField';
import AdminFormSelect from '../../components/admin/AdminFormSelect';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminSwitch from '../../components/admin/AdminSwitch';
import AppButton from '../../components/common/AppButton';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ErrorBanner from '../../components/common/ErrorBanner';
import ScreenContainer from '../../components/common/ScreenContainer';
import useUnsavedGuard from '../../hooks/useUnsavedGuard';
import { spacing } from '../../theme/typography';
import { SERVICE_TYPES, WELLBEING_CATEGORY_OPTIONS, emptyToNull, getAdminErrorMessage } from '../../utils/admin.utils';
import { categoryLabel } from '../../utils/category.utils';

const EMPTY = {
  nombre: '',
  categoria: '',
  descripcion: '',
  edificio: '',
  horario: '',
  contacto: '',
  pregunta: '',
  respuesta: '',
  activo: true,
};

/**
 * @description Convierte un recurso del backend en los valores del formulario.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Object|undefined} service - Recurso a editar, o undefined al crear
 * @returns {Object} Valores iniciales del formulario
 */
const toFormValues = (service) =>
  service
    ? {
        nombre: service.nombre || '',
        categoria: service.categoria || '',
        descripcion: service.descripcion || '',
        edificio: service.edificio || '',
        horario: service.horario || '',
        contacto: service.contacto || '',
        pregunta: service.pregunta || '',
        respuesta: service.respuesta || '',
        activo: service.activo,
      }
    : EMPTY;

/**
 * @description Pantalla de creación y edición de servicios de bienestar, dependencias del directorio
 *              y preguntas frecuentes. Recibe type (wellbeing, department o faq) y, al editar, el
 *              registro. Incluye el interruptor de activo. Pide confirmación al salir con cambios.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Object} props - Props de navegación de React Navigation
 * @param {Object} props.navigation - Objeto de navegación
 * @param {Object} props.route - Ruta actual; route.params.type y route.params.service
 * @returns {React.JSX.Element} Formulario de servicio
 */
const ServiceFormScreen = ({ navigation, route }) => {
  const { type, service } = route.params;
  const typeInfo = SERVICE_TYPES.find((item) => item.name === type);
  const initial = useMemo(() => toFormValues(service), [service]);
  const [values, setValues] = useState(initial);
  const [touched, setTouched] = useState({});
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState(null);
  const guard = useUnsavedGuard(navigation, JSON.stringify(values) !== JSON.stringify(initial));
  const isFaq = type === 'faq';

  const errors = {};
  if (isFaq) {
    if (!values.pregunta.trim()) {
      errors.pregunta = 'Ingresa la pregunta';
    }
    if (!values.respuesta.trim()) {
      errors.respuesta = 'Ingresa la respuesta';
    }
    if (!values.categoria.trim()) {
      errors.categoria = 'Ingresa la categoría';
    }
  } else {
    if (!values.nombre.trim()) {
      errors.nombre = 'Ingresa el nombre';
    }
    if (type === 'wellbeing' && !values.categoria) {
      errors.categoria = 'Elige una categoría';
    }
  }
  const valid = Object.keys(errors).length === 0;

  const setField = (field) => (text) => setValues((previous) => ({ ...previous, [field]: text }));
  const blur = (field) => () => setTouched((previous) => ({ ...previous, [field]: true }));
  const shown = (field) => (touched[field] ? errors[field] : undefined);

  const save = async () => {
    setSaving(true);
    setApiError(null);
    const body = isFaq
      ? {
          pregunta: values.pregunta.trim(),
          respuesta: values.respuesta.trim(),
          categoria: values.categoria.trim(),
          activo: values.activo,
        }
      : {
          nombre: values.nombre.trim(),
          descripcion: emptyToNull(values.descripcion),
          categoria: type === 'department' ? 'DEPARTAMENTO' : values.categoria,
          edificio: emptyToNull(values.edificio),
          horario: emptyToNull(values.horario),
          contacto: emptyToNull(values.contacto),
          activo: values.activo,
        };
    try {
      if (service) {
        await updateService(type, service.id, body);
      } else {
        await createService(type, body);
      }
      guard.allowExit();
      navigation.navigate('ServicesManagement', {
        flash: service ? 'Registro actualizado correctamente.' : 'Registro creado correctamente.',
      });
    } catch (error) {
      setApiError(getAdminErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenContainer
      header={
        <AdminHeader
          title={`${service ? 'Editar' : typeInfo && typeInfo.feminine ? 'Nueva' : 'Nuevo'} ${typeInfo ? typeInfo.singular : 'registro'}`}
          onBack={() => navigation.goBack()}
        />
      }
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <ErrorBanner message={apiError} />
        {isFaq ? (
          <>
            <AdminFormField
              label="Pregunta"
              required
              value={values.pregunta}
              onChangeText={setField('pregunta')}
              onBlur={blur('pregunta')}
              error={shown('pregunta')}
              multiline
              maxLength={500}
              showCount
            />
            <AdminFormField
              label="Respuesta"
              required
              value={values.respuesta}
              onChangeText={setField('respuesta')}
              onBlur={blur('respuesta')}
              error={shown('respuesta')}
              multiline
            />
            <AdminFormField
              label="Categoría"
              required
              value={values.categoria}
              onChangeText={(text) => setField('categoria')(text.toUpperCase())}
              onBlur={blur('categoria')}
              error={shown('categoria')}
              placeholder="Por ejemplo MATRICULAS"
              autoCapitalize="characters"
              maxLength={50}
            />
          </>
        ) : (
          <>
            <AdminFormField
              label="Nombre"
              required
              value={values.nombre}
              onChangeText={setField('nombre')}
              onBlur={blur('nombre')}
              error={shown('nombre')}
              maxLength={150}
              showCount
            />
            {type === 'wellbeing' ? (
              <AdminFormSelect
                label="Categoría"
                required
                value={values.categoria}
                onChange={(value) => {
                  setField('categoria')(value);
                  blur('categoria')();
                }}
                options={WELLBEING_CATEGORY_OPTIONS}
                error={shown('categoria')}
              />
            ) : (
              <AdminFormField label="Categoría" value={categoryLabel('DEPARTAMENTO')} onChangeText={() => null} editable={false} />
            )}
            <AdminFormField
              label={type === 'department' ? 'Función de la dependencia' : 'Descripción'}
              value={values.descripcion}
              onChangeText={setField('descripcion')}
              multiline
            />
            <AdminFormField label="Edificio" value={values.edificio} onChangeText={setField('edificio')} maxLength={100} />
            <AdminFormField
              label="Horario de atención"
              value={values.horario}
              onChangeText={setField('horario')}
              placeholder="Lunes a Viernes 8:00 AM – 5:00 PM"
              maxLength={200}
            />
            <AdminFormField
              label="Contacto"
              value={values.contacto}
              onChangeText={setField('contacto')}
              placeholder="Correo o teléfono"
              autoCapitalize="none"
              maxLength={150}
            />
          </>
        )}
        <AdminSwitch label="Activo" hint="Si está apagado, los estudiantes no lo verán" value={values.activo} onChange={(value) => setValues((previous) => ({ ...previous, activo: value }))} />
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

export default ServiceFormScreen;
