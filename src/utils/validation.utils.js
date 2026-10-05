import { parseIsoDate, toIsoDate } from './date.utils';

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@(campusucc\.edu\.co|ucc\.edu\.co)$/i;
const PHONE_REGEX = /^[0-9+()\- ]{7,20}$/;

/**
 * @description Valida que un correo pertenezca a un dominio institucional de la UCC.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @param {string} value - Correo a validar
 * @returns {boolean} true si tiene formato usuario@campusucc.edu.co o usuario@ucc.edu.co
 */
export const isInstitutionalEmail = (value) => EMAIL_REGEX.test(String(value || '').trim());

/**
 * @description Evalúa cada requisito de la contraseña de registro.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @param {string} password - Contraseña en texto plano
 * @returns {{ length: boolean, upper: boolean, number: boolean, special: boolean }} Cumplimiento de cada requisito
 */
export const getPasswordChecks = (password) => {
  const value = String(password || '');
  return {
    length: value.length >= 8,
    upper: /[A-Z]/.test(value),
    number: /\d/.test(value),
    special: /[^A-Za-z0-9]/.test(value),
  };
};

/**
 * @description Calcula la fortaleza de una contraseña según los requisitos cumplidos.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @param {string} password - Contraseña en texto plano
 * @returns {{ score: number, level: 'empty'|'weak'|'medium'|'strong', label: string }} Puntaje de 0 a 4, nivel y texto
 */
export const getPasswordStrength = (password) => {
  if (!password) {
    return { score: 0, level: 'empty', label: '' };
  }
  const score = Object.values(getPasswordChecks(password)).filter(Boolean).length;
  if (score <= 2) {
    return { score, level: 'weak', label: 'Débil' };
  }
  if (score === 3) {
    return { score, level: 'medium', label: 'Media' };
  }
  return { score, level: 'strong', label: 'Fuerte' };
};

/**
 * @description Indica si una contraseña cumple todos los requisitos de registro.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @param {string} password - Contraseña en texto plano
 * @returns {boolean} true si cumple longitud, mayúscula, número y carácter especial
 */
export const isValidPassword = (password) => Object.values(getPasswordChecks(password)).every(Boolean);

/**
 * @description Valida un teléfono opcional con el mismo formato que exige el backend.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @param {string} value - Teléfono a validar, vacío es válido
 * @returns {boolean} true si está vacío o tiene entre 7 y 20 caracteres válidos
 */
export const isValidPhone = (value) => {
  const text = String(value || '').trim();
  return text === '' || PHONE_REGEX.test(text);
};

/**
 * @description Valida una fecha escrita como YYYY-MM-DD, comprobando que exista en el calendario.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {string} value - Fecha escrita por el usuario
 * @returns {boolean} true si es una fecha real
 */
export const isValidDateInput = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ''))) {
    return false;
  }
  return toIsoDate(parseIsoDate(value)) === value;
};

/**
 * @description Valida todos los campos del formulario de registro.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @param {Object} values - Valores del formulario
 * @param {string} values.nombre - Nombres
 * @param {string} values.apellido - Apellidos
 * @param {string} values.correo - Correo institucional
 * @param {string} values.programaAcademico - Programa académico
 * @param {string} values.contrasena - Contraseña
 * @param {string} values.confirmacion - Confirmación de la contraseña
 * @returns {Object} Mensajes de error por campo; vacío si el formulario es válido
 */
export const validateRegisterForm = (values) => {
  const errors = {};
  if (!values.nombre.trim()) {
    errors.nombre = 'Ingresa tu nombre';
  }
  if (!values.apellido.trim()) {
    errors.apellido = 'Ingresa tu apellido';
  }
  if (!isInstitutionalEmail(values.correo)) {
    errors.correo = 'Usa tu correo institucional (@campusucc.edu.co o @ucc.edu.co)';
  }
  if (!values.programaAcademico.trim()) {
    errors.programaAcademico = 'Ingresa tu programa académico';
  }
  if (!isValidPassword(values.contrasena)) {
    errors.contrasena = 'Mínimo 8 caracteres, una mayúscula, un número y un carácter especial';
  }
  if (values.confirmacion !== values.contrasena || !values.confirmacion) {
    errors.confirmacion = 'Las contraseñas no coinciden';
  }
  return errors;
};
