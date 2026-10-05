import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { createSpace, updateSpace } from '../../api/admin.api';
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
import { SPACE_CATEGORY_OPTIONS, emptyToNull, getAdminErrorMessage } from '../../utils/admin.utils';

const EMPTY = {
  nombre: '',
  codigo: '',
  categoria: '',
  edificio: '',
  piso: '',
  descripcion: '',
  referencia: '',
  activo: true,
};

/**
 * @description Convierte un espacio del backend en los valores del formulario.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {Object|undefined} space - Espacio a editar, o undefined al crear
 * @returns {Object} Valores iniciales del formulario
 */
const toFormValues = (space) =>
  space
    ? {
        nombre: space.nombre,
        codigo: space.codigo,
        categoria: space.categoria,
        edificio: space.edificio || '',
        piso: space.piso || '',
        descripcion: space.descripcion || '',
        referencia: space.referencia || '',
        activo: space.activo,
      }
    : EMPTY;

/**
 * @description Pantalla de creación y edición de espacios del campus. El código se convierte a
 *              mayúsculas mientras se escribe. Un código repetido muestra "El código ya existe, usa
 *              otro diferente". Pide confirmación al salir con cambios sin guardar.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {Object} props - Props de navegación de React Navigation
 * @param {Object} props.navigation - Objeto de navegación
 * @param {Object} props.route - Ruta actual; route.params.space es el espacio a editar
 * @returns {React.JSX.Element} Formulario de espacio
 */
const SpaceFormScreen = ({ navigation, route }) => {
  const space = route.params ? route.params.space : undefined;
  const initial = useMemo(() => toFormValues(space), [space]);
  const [values, setValues] = useState(initial);
  const [touched, setTouched] = useState({});
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState(null);
  const guard = useUnsavedGuard(navigation, JSON.stringify(values) !== JSON.stringify(initial));

  const errors = {};
  if (!values.nombre.trim()) {
    errors.nombre = 'Ingresa el nombre del espacio';
  }
  if (!values.codigo.trim()) {
    errors.codigo = 'Ingresa el código del espacio';
  }
  if (!values.categoria) {
    errors.categoria = 'Elige una categoría';
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
      categoria: values.categoria,
      edificio: emptyToNull(values.edificio),
      piso: emptyToNull(values.piso),
      descripcion: emptyToNull(values.descripcion),
      referencia: emptyToNull(values.referencia),
      activo: values.activo,
    };
    try {
      if (space) {
        await updateSpace(space.id, body);
      } else {
        await createSpace(body);
      }
      guard.allowExit();
      navigation.navigate('SpacesManagement', {
        flash: space ? 'Espacio actualizado correctamente.' : 'Espacio creado correctamente.',
      });
    } catch (error) {
      setApiError(getAdminErrorMessage(error, { 409: 'El código ya existe, usa uno diferente' }));
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenContainer
      header={<AdminHeader title={space ? 'Editar espacio' : 'Nuevo espacio'} onBack={() => navigation.goBack()} />}
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
          showCount
        />
        <AdminFormField
          label="Código"
          required
          value={values.codigo}
          onChangeText={(text) => setField('codigo')(text.toUpperCase())}
          onBlur={blur('codigo')}
          error={shown('codigo')}
          placeholder="Por ejemplo LAB-101"
          autoCapitalize="characters"
          maxLength={30}
        />
        <AdminFormSelect
          label="Categoría"
          required
          value={values.categoria}
          onChange={(value) => {
            setField('categoria')(value);
            blur('categoria')();
          }}
          options={SPACE_CATEGORY_OPTIONS}
          error={shown('categoria')}
        />
        <AdminFormField label="Edificio" value={values.edificio} onChangeText={setField('edificio')} maxLength={100} />
        <AdminFormField label="Piso" value={values.piso} onChangeText={setField('piso')} maxLength={30} />
        <AdminFormField label="Descripción" value={values.descripcion} onChangeText={setField('descripcion')} multiline />
        <AdminFormField
          label="Referencia de ubicación"
          value={values.referencia}
          onChangeText={setField('referencia')}
          placeholder="Cómo llegar, en lenguaje natural"
          multiline
        />
        <AdminSwitch
          label="Activo"
          hint="Si está apagado, los estudiantes no lo verán"
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

export default SpaceFormScreen;
