import { emptyToNull, isValidTimeInput } from './admin.utils';
import { formatTime } from './date.utils';

export const PERSONAL_ORIGIN = 'PERSONAL';

export const isPersonalClass = (subject) => Boolean(subject) && subject.origen === PERSONAL_ORIGIN;

export const personalClassValues = (subject, day) => ({
  nombre: subject ? subject.nombre || '' : '',
  docente: subject ? subject.docente || '' : '',
  aula: subject ? subject.aula || '' : '',
  dias: subject ? [...(subject.dias || [])] : day ? [day] : [],
  horaInicio: subject ? formatTime(subject.horaInicio) : '',
  horaFin: subject ? formatTime(subject.horaFin) : '',
});

export const validatePersonalClass = (values) => {
  const errors = {};
  const nombre = String(values.nombre || '').trim();
  if (!nombre) {
    errors.nombre = 'Escribe el nombre de la clase';
  } else if (nombre.length > 150) {
    errors.nombre = 'Máximo 150 caracteres';
  }
  if (String(values.docente || '').trim().length > 150) {
    errors.docente = 'Máximo 150 caracteres';
  }
  if (String(values.aula || '').trim().length > 50) {
    errors.aula = 'Máximo 50 caracteres';
  }
  if (!values.dias || values.dias.length === 0) {
    errors.dias = 'Elige al menos un día';
  }
  if (!isValidTimeInput(values.horaInicio)) {
    errors.horaInicio = 'Usa el formato HH:MM, por ejemplo 07:00';
  }
  if (!isValidTimeInput(values.horaFin)) {
    errors.horaFin = 'Usa el formato HH:MM, por ejemplo 09:00';
  } else if (isValidTimeInput(values.horaInicio) && values.horaFin <= values.horaInicio) {
    errors.horaFin = 'Debe ser después de la hora de inicio';
  }
  return errors;
};

export const toPersonalClassPayload = (values) => ({
  nombre: String(values.nombre).trim(),
  docente: emptyToNull(values.docente),
  aula: emptyToNull(values.aula),
  dias: values.dias,
  horaInicio: `${values.horaInicio}:00`,
  horaFin: `${values.horaFin}:00`,
});

export const maskTime = (text) => {
  const digits = String(text || '')
    .replace(/\D/g, '')
    .slice(0, 4);
  return digits.length <= 2 ? digits : `${digits.slice(0, 2)}:${digits.slice(2)}`;
};
