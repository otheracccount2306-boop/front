import React, { useEffect, useState } from 'react';
import AuthLayout from '../../components/auth/AuthLayout';
import AppButton from '../../components/common/AppButton';
import AppInput from '../../components/common/AppInput';
import ErrorBanner from '../../components/common/ErrorBanner';
import useAuth from '../../hooks/useAuth';
import { isInstitutionalEmail } from '../../utils/validation.utils';

const RESEND_SECONDS = 60;

const ForgotPasswordScreen = ({ navigation }) => {
  const { requestRecovery } = useAuth();
  const [correo, setCorreo] = useState('');
  const [error, setError] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) {
      return undefined;
    }
    const timer = setTimeout(() => setCooldown((previous) => previous - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const submit = async () => {
    if (!isInstitutionalEmail(correo)) {
      setError('Ingresa un correo institucional válido');
      return;
    }
    setError(null);
    setApiError(null);
    setLoading(true);
    try {
      await requestRecovery(correo);
      setSent(true);
      setCooldown(RESEND_SECONDS);
    } catch (requestError) {
      setApiError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  let buttonLabel = 'Enviar instrucciones';
  if (cooldown > 0) {
    buttonLabel = `Reenviar en ${cooldown} s`;
  } else if (sent) {
    buttonLabel = 'Reenviar instrucciones';
  }

  return (
    <AuthLayout
      title="Recuperar contraseña"
      subtitle="Te enviaremos instrucciones a tu correo"
      onBack={() => navigation.goBack()}
    >
      {sent ? (
        <ErrorBanner
          variant="success"
          message="Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña."
        />
      ) : null}
      <ErrorBanner message={apiError} />
      <AppInput
        label="Correo institucional"
        value={correo}
        onChangeText={setCorreo}
        placeholder="usuario@campusucc.edu.co"
        keyboardType="email-address"
        error={error}
      />
      <AppButton label={buttonLabel} onPress={submit} loading={loading} disabled={cooldown > 0} />
    </AuthLayout>
  );
};

export default ForgotPasswordScreen;
