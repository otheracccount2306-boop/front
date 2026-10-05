import apiClient from './client';

/**
 * @description Registra un nuevo estudiante con consentimiento de datos.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @param {Object} payload - Datos de registro
 * @param {string} payload.nombre - Nombres
 * @param {string} payload.apellido - Apellidos
 * @param {string} payload.correo - Correo institucional
 * @param {string} payload.contrasena - Contraseña
 * @param {string} payload.programaAcademico - Programa académico
 * @param {boolean} payload.consentimientoDatos - Aceptación de la política de datos
 * @returns {Promise<{ id: string }>} Identificador del usuario creado
 */
export const register = async (payload) => (await apiClient.post('/auth/register', payload)).data.data;

/**
 * @description Inicia sesión con correo y contraseña.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @param {string} correo - Correo institucional
 * @param {string} contrasena - Contraseña
 * @returns {Promise<Object>} Tokens y datos del usuario (accessToken, refreshToken, usuario)
 */
export const login = async (correo, contrasena) =>
  (await apiClient.post('/auth/login', { correo, contrasena })).data.data;

/**
 * @description Cierra la sesión en el servidor invalidando los refresh tokens del usuario.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @returns {Promise<void>} Promesa resuelta al cerrar la sesión
 */
export const logout = async () => {
  await apiClient.post('/auth/logout');
};

/**
 * @description Solicita el correo de recuperación de contraseña. El backend siempre responde 200.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @param {string} correo - Correo del usuario
 * @returns {Promise<void>} Promesa resuelta al enviar la solicitud
 */
export const requestPasswordRecovery = async (correo) => {
  await apiClient.post('/auth/password-recovery', { correo });
};

/**
 * @description Restablece la contraseña con el token de recuperación recibido.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @param {string} token - Token de recuperación
 * @param {string} nuevaContrasena - Nueva contraseña
 * @returns {Promise<void>} Promesa resuelta al restablecer la contraseña
 */
export const resetPassword = async (token, nuevaContrasena) => {
  await apiClient.post('/auth/password-reset', { token, nuevaContrasena });
};

/**
 * @description Obtiene el perfil del usuario autenticado.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @returns {Promise<Object>} Perfil del usuario
 */
export const getProfile = async () => (await apiClient.get('/users/profile')).data.data;

/**
 * @description Actualiza nombre, apellido, programa y teléfono del usuario autenticado.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @param {Object} payload - Campos editables del perfil
 * @param {string} payload.nombre - Nombres
 * @param {string} payload.apellido - Apellidos
 * @param {string} payload.programaAcademico - Programa académico
 * @param {string} payload.telefono - Teléfono de contacto
 * @returns {Promise<Object>} Perfil actualizado
 */
export const updateProfile = async (payload) => (await apiClient.put('/users/profile', payload)).data.data;
