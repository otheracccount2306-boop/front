import { parseIsoDate, toIsoDate } from './date.utils';

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@(campusucc\.edu\.co|ucc\.edu\.co)$/i;
const PHONE_REGEX = /^[0-9+()\- ]{7,20}$/;

export const isInstitutionalEmail = (value) => EMAIL_REGEX.test(String(value || '').trim());

export const getPasswordChecks = (password) => {
  const value = String(password || '');
  return {
    length: value.length >= 8,
    upper: /[A-Z]/.test(value),
    number: /\d/.test(value),
    special: /[^A-Za-z0-9]/.test(value),
  };
};

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

export const isValidPassword = (password) => Object.values(getPasswordChecks(password)).every(Boolean);

export const isValidPhone = (value) => {
  const text = String(value || '').trim();
  return text === '' || PHONE_REGEX.test(text);
};

export const isValidDateInput = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ''))) {
    return false;
  }
  return toIsoDate(parseIsoDate(value)) === value;
};

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
