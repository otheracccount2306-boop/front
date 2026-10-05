import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { createPlan, getAdminPlan, updatePlan } from '../../api/admin.api';
import AdminFormField from '../../components/admin/AdminFormField';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminSwitch from '../../components/admin/AdminSwitch';
import PlanImagePicker from '../../components/admin/map/PlanImagePicker';
import AppButton from '../../components/common/AppButton';
import AppLoader from '../../components/common/AppLoader';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ErrorBanner from '../../components/common/ErrorBanner';
import ScreenContainer from '../../components/common/ScreenContainer';
import useUnsavedGuard from '../../hooks/useUnsavedGuard';
import { spacing } from '../../theme/typography';
import { emptyToNull, getAdminErrorMessage } from '../../utils/admin.utils';

const EMPTY = { nombre: '', edificio: '', piso: '', activo: true };

/**
 * @description Pantalla de creación y edición de un plano del campus: nombre, edificio, piso e imagen.
 *              La imagen se optimiza en el navegador antes de enviarla. Al crear un plano lleva
 *              directo al editor para dibujar los espacios.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {Object} props - Props de navegación de React Navigation
 * @param {Object} props.navigation - Objeto de navegación
 * @param {Object} props.route - Ruta actual; route.params.planId es el plano a editar
 * @returns {React.JSX.Element} Formulario de plano
 */
const PlanFormScreen = ({ navigation, route }) => {
  const planId = route.params ? route.params.planId : undefined;
  const [values, setValues] = useState(EMPTY);
  const [initial, setInitial] = useState(EMPTY);
  const [image, setImage] = useState(null);
  const [imageChanged, setImageChanged] = useState(false);
  const [loading, setLoading] = useState(Boolean(planId));
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [touched, setTouched] = useState(false);
  const guard = useUnsavedGuard(navigation, imageChanged || JSON.stringify(values) !== JSON.stringify(initial));

  useEffect(() => {
    if (!planId) {
      return undefined;
    }
    let active = true;
    getAdminPlan(planId)
      .then((plan) => {
        if (!active) {
          return;
        }
        const loaded = { nombre: plan.nombre, edificio: plan.edificio || '', piso: plan.piso || '', activo: plan.activo };
        setValues(loaded);
        setInitial(loaded);
        setImage({ imagen: plan.imagen, ancho: plan.ancho, alto: plan.alto });
      })
      .catch((error) => active && setApiError(getAdminErrorMessage(error)))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [planId]);

  const errors = {};
  if (!values.nombre.trim()) {
    errors.nombre = 'Ingresa el nombre del plano, por ejemplo "Bloque C · Piso 1"';
  }
  if (!image) {
    errors.imagen = 'Sube la imagen del plano';
  }
  const valid = Object.keys(errors).length === 0;
  const setField = (field) => (text) => setValues((previous) => ({ ...previous, [field]: text }));

  const save = async () => {
    setSaving(true);
    setApiError(null);
    const body = {
      nombre: values.nombre.trim(),
      edificio: emptyToNull(values.edificio),
      piso: emptyToNull(values.piso),
      imagen: !planId || imageChanged ? image.imagen : null,
      ancho: image.ancho,
      alto: image.alto,
      activo: values.activo,
    };
    try {
      if (planId) {
        await updatePlan(planId, body);
        guard.allowExit();
        navigation.navigate('PlansManagement', { flash: 'Plano actualizado correctamente.' });
      } else {
        const created = await createPlan(body);
        guard.allowExit();
        navigation.replace('PlanEditor', { planId: created.id });
      }
    } catch (error) {
      setApiError(getAdminErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenContainer
      header={<AdminHeader title={planId ? 'Editar plano' : 'Nuevo plano'} onBack={() => navigation.goBack()} />}
    >
      {loading ? (
        <AppLoader fill />
      ) : (
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <ErrorBanner message={apiError} />
          <AdminFormField
            label="Nombre"
            required
            value={values.nombre}
            onChangeText={setField('nombre')}
            onBlur={() => setTouched(true)}
            error={touched ? errors.nombre : undefined}
            placeholder="Por ejemplo Bloque C · Piso 1"
            maxLength={150}
            showCount
          />
          <AdminFormField label="Edificio" value={values.edificio} onChangeText={setField('edificio')} maxLength={100} />
          <AdminFormField label="Piso" value={values.piso} onChangeText={setField('piso')} maxLength={30} />
          <PlanImagePicker
            value={image}
            onChange={(next) => {
              setImage(next);
              setImageChanged(true);
            }}
            error={touched ? errors.imagen : undefined}
          />
          <AdminSwitch
            label="Activo"
            hint="Si está apagado, los estudiantes no verán este plano en el mapa"
            value={values.activo}
            onChange={(value) => setValues((previous) => ({ ...previous, activo: value }))}
          />
          <View style={styles.actions}>
            <AppButton label="Cancelar" variant="outline" onPress={() => navigation.goBack()} style={styles.action} />
            <AppButton
              label={planId ? 'Guardar' : 'Crear y dibujar'}
              onPress={save}
              disabled={!valid}
              loading={saving}
              style={styles.action}
            />
          </View>
        </ScrollView>
      )}
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

export default PlanFormScreen;
