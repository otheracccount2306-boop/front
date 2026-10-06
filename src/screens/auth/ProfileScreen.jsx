import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import AppButton from '../../components/common/AppButton';
import AppDivider from '../../components/common/AppDivider';
import AppInput from '../../components/common/AppInput';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ErrorBanner from '../../components/common/ErrorBanner';
import ScreenContainer from '../../components/common/ScreenContainer';
import ScreenHeader from '../../components/common/ScreenHeader';
import useAuth from '../../hooks/useAuth';
import colors from '../../theme/colors';
import { fontSizes, spacing } from '../../theme/typography';
import { getInitials } from '../../utils/text.utils';
import { isValidPhone } from '../../utils/validation.utils';

const EDITABLE_FIELDS = ['nombre', 'apellido', 'programaAcademico', 'telefono'];
const ROLE_LABELS = { ESTUDIANTE: 'Estudiante', ADMINISTRADOR: 'Administrador' };

const toFormValues = (user) => ({
  nombre: (user && user.nombre) || '',
  apellido: (user && user.apellido) || '',
  programaAcademico: (user && user.programaAcademico) || '',
  telefono: (user && user.telefono) || '',
});

const ProfileScreen = ({ navigation }) => {
  const { user, loadProfile, saveProfile, logout } = useAuth();
  const initial = useMemo(() => toFormValues(user), [user]);
  const [values, setValues] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    loadProfile().catch(() => null);
  }, [loadProfile]);

  useEffect(() => {
    setValues(initial);
  }, [initial]);

  const dirty = EDITABLE_FIELDS.some((field) => values[field].trim() !== initial[field].trim());
  const errors = {
    nombre: values.nombre.trim() ? undefined : 'Ingresa tu nombre',
    apellido: values.apellido.trim() ? undefined : 'Ingresa tu apellido',
    telefono: isValidPhone(values.telefono) ? undefined : 'Teléfono inválido (7 a 20 dígitos)',
  };
  const hasErrors = Boolean(errors.nombre || errors.apellido || errors.telefono);

  const setField = (field) => (text) => {
    setMessage(null);
    setValues((previous) => ({ ...previous, [field]: text }));
  };

  const save = async () => {
    setSaving(true);
    setApiError(null);
    setMessage(null);
    try {
      await saveProfile(values);
      setMessage('Perfil actualizado correctamente.');
    } catch (error) {
      setApiError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const confirmLogout = async () => {
    setLoggingOut(true);
    await logout();
  };

  return (
    <ScreenContainer header={<ScreenHeader title="Mi perfil" onBack={() => navigation.goBack()} />}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.avatarWrapper}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(initial.nombre, initial.apellido)}</Text>
          </View>
          <Text style={styles.email}>{user ? user.correo : ''}</Text>
        </View>
        <ErrorBanner variant="success" message={message} />
        <ErrorBanner message={apiError} />
        <AppInput label="Nombre" value={values.nombre} onChangeText={setField('nombre')} error={errors.nombre} autoCapitalize="words" maxLength={100} />
        <AppInput label="Apellido" value={values.apellido} onChangeText={setField('apellido')} error={errors.apellido} autoCapitalize="words" maxLength={100} />
        <AppInput label="Programa académico" value={values.programaAcademico} onChangeText={setField('programaAcademico')} autoCapitalize="sentences" maxLength={150} />
        <AppInput label="Teléfono" value={values.telefono} onChangeText={setField('telefono')} error={errors.telefono} keyboardType="phone-pad" maxLength={20} />
        <AppInput label="Correo institucional" value={user ? user.correo : ''} onChangeText={() => null} editable={false} />
        <AppInput label="Rol" value={user ? ROLE_LABELS[user.rol] || user.rol : ''} onChangeText={() => null} editable={false} />
        <AppButton label="Guardar cambios" onPress={save} disabled={!dirty || hasErrors} loading={saving} />
        <AppDivider />
        <AppButton label="Cerrar sesión" variant="danger" onPress={() => setConfirmVisible(true)} />
      </ScrollView>
      <ConfirmDialog
        visible={confirmVisible}
        title="Cerrar sesión"
        message="¿Seguro que quieres cerrar tu sesión?"
        confirmLabel="Cerrar sesión"
        loading={loggingOut}
        onCancel={() => setConfirmVisible(false)}
        onConfirm={confirmLogout}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  avatarWrapper: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: fontSizes.title,
    fontWeight: '700',
    color: colors.white,
  },
  email: {
    fontSize: fontSizes.body,
    color: colors.gray2,
    marginTop: spacing.sm,
  },
});

export default ProfileScreen;
