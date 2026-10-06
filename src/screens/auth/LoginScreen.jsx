import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import AuthLayout from '../../components/auth/AuthLayout';
import AppButton from '../../components/common/AppButton';
import AppInput from '../../components/common/AppInput';
import ErrorBanner from '../../components/common/ErrorBanner';
import useAuth from '../../hooks/useAuth';
import colors from '../../theme/colors';
import { fontSizes, spacing } from '../../theme/typography';
import { clearLoginLock, formatRemaining, getLoginLock, registerFailedAttempt } from '../../utils/loginLock.utils';
import { isInstitutionalEmail } from '../../utils/validation.utils';

const LoginScreen = ({ navigation, route }) => {
  const { login, sessionExpired } = useAuth();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lock, setLock] = useState(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    getLoginLock().then((record) => record && record.lockedUntil && setLock(record));
  }, []);

  useEffect(() => {
    if (!lock || !lock.lockedUntil) {
      return undefined;
    }
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [lock]);

  const remaining = lock && lock.lockedUntil ? lock.lockedUntil - now : 0;
  const isLocked = remaining > 0 && lock.correo === correo.trim().toLowerCase();

  const submit = async () => {
    const nextErrors = {};
    if (!isInstitutionalEmail(correo)) {
      nextErrors.correo = 'Ingresa un correo institucional válido';
    }
    if (!contrasena) {
      nextErrors.contrasena = 'Ingresa tu contraseña';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }
    setLoading(true);
    setApiError(null);
    try {
      await login(correo, contrasena);
      await clearLoginLock();
    } catch (error) {
      setApiError(error.message);
      if (error.status === 401) {
        const record = await registerFailedAttempt(correo);
        if (record.lockedUntil) {
          setLock(record);
          setNow(Date.now());
        }
      }
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Iniciar sesión" subtitle="Accede con tu correo institucional">
      {route.params && route.params.registered ? (
        <ErrorBanner variant="success" message="Cuenta creada correctamente. Ya puedes iniciar sesión." />
      ) : null}
      {sessionExpired ? (
        <ErrorBanner variant="info" message="Tu sesión expiró. Inicia sesión de nuevo para continuar." />
      ) : null}
      {isLocked ? (
        <ErrorBanner message={`Demasiados intentos fallidos. Intenta de nuevo en ${formatRemaining(remaining)}.`} />
      ) : (
        <ErrorBanner message={apiError} />
      )}
      <AppInput
        label="Correo institucional"
        value={correo}
        onChangeText={setCorreo}
        placeholder="usuario@campusucc.edu.co"
        keyboardType="email-address"
        error={errors.correo}
        testID="login-correo"
      />
      <AppInput
        label="Contraseña"
        value={contrasena}
        onChangeText={setContrasena}
        placeholder="Tu contraseña"
        secureTextEntry
        error={errors.contrasena}
        testID="login-contrasena"
      />
      <AppButton label="Ingresar" onPress={submit} loading={loading} disabled={isLocked} />
      <View style={styles.links}>
        <Pressable onPress={() => navigation.navigate('ForgotPassword')} accessibilityRole="link">
          <Text style={styles.link}>Olvidé mi contraseña</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Register')} accessibilityRole="link">
          <Text style={styles.link}>Registrarse</Text>
        </Pressable>
      </View>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  links: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
  },
  link: {
    fontSize: fontSizes.body,
    fontWeight: '600',
    color: colors.primary,
  },
});

export default LoginScreen;
