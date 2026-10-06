const TECHNICAL_MESSAGES = [
  'Datos de entrada inválidos',
  'Solicitud mal formada o con parámetros inválidos',
  'Error interno del servidor',
  'Not Found',
];

export const extractServerMessage = (error) => {
  const body = error && error.response ? error.response.data : null;
  if (!body) {
    return null;
  }
  if (typeof body.message === 'string' && body.message) {
    return body.message;
  }
  return typeof body.error === 'string' && body.error ? body.error : null;
};

export const getErrorMessage = (error, overrides = {}) => {
  if (error && error.isFriendly) {
    return error.message;
  }
  if (!error || !error.isAxiosError) {
    return 'Ocurrió un error inesperado. Intenta de nuevo.';
  }
  if (!error.response) {
    return 'No se pudo conectar con el servidor. Revisa tu conexión a internet.';
  }
  const { status } = error.response;
  if (overrides[status]) {
    return overrides[status];
  }
  const serverMessage = extractServerMessage(error);
  if ((status === 400 || status === 422) && serverMessage && !TECHNICAL_MESSAGES.includes(serverMessage)) {
    return serverMessage;
  }
  switch (status) {
    case 400:
      return 'Revisa los datos ingresados e intenta de nuevo.';
    case 401:
      return 'Tu sesión no es válida. Inicia sesión de nuevo.';
    case 403:
      return 'No tienes permisos para realizar esta acción.';
    case 404:
      return 'No encontramos lo que buscas.';
    case 409:
      return 'La información ya existe o entra en conflicto con otra.';
    case 422:
      return 'No fue posible procesar la solicitud.';
    default:
      return status >= 500
        ? 'El servidor tuvo un problema. Intenta de nuevo en unos minutos.'
        : 'No fue posible completar la solicitud.';
  }
};

export const toFriendlyError = (error, overrides = {}) => {
  const friendly = new Error(getErrorMessage(error, overrides));
  friendly.status = error && error.response ? error.response.status : null;
  friendly.isFriendly = true;
  return friendly;
};
