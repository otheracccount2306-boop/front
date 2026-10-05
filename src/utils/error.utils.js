const TECHNICAL_MESSAGES = [
  'Datos de entrada inválidos',
  'Solicitud mal formada o con parámetros inválidos',
  'Error interno del servidor',
  'Not Found',
];

/**
 * @description Extrae el mensaje que envió el backend. Acepta el formato { message } que
 *              devuelve la API y el formato alterno { error } descrito en la documentación.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Object} error - Error de Axios
 * @returns {string|null} Mensaje del servidor o null si no viene ninguno
 */
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

/**
 * @description Traduce un error de red o de la API a un mensaje amigable en español, sin
 *              detalles técnicos. Los mensajes de negocio del backend (400 y 422) se conservan.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Object} error - Error de Axios o error ya traducido
 * @param {Object} overrides - Mensajes específicos por código HTTP, por ejemplo { 409: 'El correo ya está registrado' }
 * @returns {string} Mensaje para mostrar al usuario
 */
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

/**
 * @description Convierte un error de Axios en un Error con mensaje amigable y el código HTTP,
 *              listo para que las pantallas lo muestren sin volver a interpretarlo.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Object} error - Error de Axios
 * @param {Object} overrides - Mensajes específicos por código HTTP
 * @returns {Error} Error con propiedades message, status e isFriendly
 */
export const toFriendlyError = (error, overrides = {}) => {
  const friendly = new Error(getErrorMessage(error, overrides));
  friendly.status = error && error.response ? error.response.status : null;
  friendly.isFriendly = true;
  return friendly;
};
