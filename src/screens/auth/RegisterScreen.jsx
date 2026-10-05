import React, { useMemo, useState } from 'react';
import AuthLayout from '../../components/auth/AuthLayout';
import PasswordStrength from '../../components/auth/PasswordStrength';
import PolicyCheckbox from '../../components/auth/PolicyCheckbox';
import AppButton from '../../components/common/AppButton';
import AppInput from '../../components/common/AppInput';
import ErrorBanner from '../../components/common/ErrorBanner';
import useAuth from '../../hooks/useAuth';
import { validateRegisterForm } from '../../utils/validation.utils';

const INITIAL_VALUES = {
  nombre: '',
  apellido: '',
  correo: '',
  programaAcademico: '',
  contrasena: '',
  confirmacion: '',
};

/**
 * @description Pantalla de registro de estudiantes. Valida cada campo (el error se muestra al salir
 *              del campo), exige aceptar la política de datos y mantiene el botón deshabilitado hasta
 *              que el formulario sea válido. Al registrarse navega al login con un mensaje de éxito.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @param {Object} props - Props de navegación de React Navigation
 * @param {Object} props.navigation - Objeto de navegación
 * @returns {React.JSX.Element} Pantalla de registro
 */
const RegisterScreen = ({ navigation }) => {
  const { register } = useAuth();
  const [values, setValues] = useState(INITIAL_VALUES);
  const [touched, setTouched] = useState({});
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const errors = useMemo(() => validateRegisterForm(values), [values]);
  const canSubmit = Object.keys(errors).length === 0 && accepted;

  const setField = (field) => (text) => setValues((previous) => ({ ...previous, [field]: text }));
  const markTouched = (field) => () => setTouched((previous) => ({ ...previous, [field]: true }));
  const fieldError = (field) => (touched[field] ? errors[field] : undefined);

  const submit = async () => {
    setLoading(true);
    setApiError(null);
    try {
      await register(values);
      navigation.navigate('Login', { registered: true });
    } catch (error) {
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Crear cuenta" subtitle="Regístrate con tu correo institucional" onBack={() => navigation.goBack()}>
      <ErrorBanner message={apiError} />
      <AppInput
        label="Nombre"
        value={values.nombre}
        onChangeText={setField('nombre')}
        onBlur={markTouched('nombre')}
        error={fieldError('nombre')}
        autoCapitalize="words"
        maxLength={100}
      />
      <AppInput
        label="Apellido"
        value={values.apellido}
        onChangeText={setField('apellido')}
        onBlur={markTouched('apellido')}
        error={fieldError('apellido')}
        autoCapitalize="words"
        maxLength={100}
      />
      <AppInput
        label="Correo institucional"
        value={values.correo}
        onChangeText={setField('correo')}
        onBlur={markTouched('correo')}
        error={fieldError('correo')}
        placeholder="usuario@campusucc.edu.co"
        keyboardType="email-address"
        maxLength={150}
      />
      <AppInput
        label="Programa académico"
        value={values.programaAcademico}
        onChangeText={setField('programaAcademico')}
        onBlur={markTouched('programaAcademico')}
        error={fieldError('programaAcademico')}
        placeholder="Ingeniería de Software"
        autoCapitalize="sentences"
        maxLength={150}
      />
      <AppInput
        label="Contraseña"
        value={values.contrasena}
        onChangeText={setField('contrasena')}
        onBlur={markTouched('contrasena')}
        error={fieldError('contrasena')}
        secureTextEntry
        maxLength={72}
      />
      <PasswordStrength password={values.contrasena} />
      <AppInput
        label="Confirmar contraseña"
        value={values.confirmacion}
        onChangeText={setField('confirmacion')}
        onBlur={markTouched('confirmacion')}
        error={fieldError('confirmacion')}
        secureTextEntry
        maxLength={72}
      />
      <PolicyCheckbox checked={accepted} onChange={setAccepted} />
      <AppButton label="Registrarme" onPress={submit} disabled={!canSubmit} loading={loading} />
    </AuthLayout>
  );
};

export default RegisterScreen;
