import { emptyToNull, isValidTimeInput } from './admin.utils';
import { formatTime } from './date.utils';

/** Origen de las clases que registra el propio estudiante (lo devuelve el backend). */
export const PERSONAL_ORIGIN = 'PERSONAL';

/**
 * @description Indica si una clase del horario la registró el estudiante (y por tanto puede editarla).
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {Object} subject - Clase del horario
 * @returns {boolean} true si es una clase personal
 */
export const isPersonalClass = (subject) => Boolean(subject) && subject.origen === PERSONAL_ORIGIN;

/**
 * @description Valores iniciales del formulario: vacíos para una clase nueva o los de la clase a editar.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {Object|null} subject - Clase personal a editar, o null
 * @param {string} [day] - Día preseleccionado para una clase nueva, por ejemplo LUNES
 * @returns {{ nombre: string, docente: string, aula: string, dias: string[], horaInicio: string, horaFin: string }}
 */
export const personalClassValues = (subject, day) => ({
  nombre: subject ? subject.nombre || '' : '',
  docente: subject ? subject.docente || '' : '',
  aula: subject ? subject.aula || '' : '',
  dias: subject ? [...(subject.dias || [])] : day ? [day] : [],
  horaInicio: subject ? formatTime(subject.horaInicio) : '',
  horaFin: subject ? formatTime(subject.horaFin) : '',
});

/**
 * @description Valida el formulario de una clase personal con las mismas reglas del backend.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {Object} values - Valores del formulario
 * @returns {Object} Errores por campo; vacío si todo es válido
 */
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

/**
 * @description Convierte el formulario en el cuerpo que espera la API (horas con segundos).
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {Object} values - Valores válidos del formulario
 * @returns {Object} { nombre, docente, aula, dias, horaInicio, horaFin }
 */
export const toPersonalClassPayload = (values) => ({
  nombre: String(values.nombre).trim(),
  docente: emptyToNull(values.docente),
  aula: emptyToNull(values.aula),
  dias: values.dias,
  horaInicio: `${values.horaInicio}:00`,
  horaFin: `${values.horaFin}:00`,
});

/**
 * @description Escribe la hora mientras el estudiante teclea: deja solo dígitos y pone los dos
 *              puntos después de la hora, de modo que "1430" queda "14:30".
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {string} text - Texto escrito
 * @returns {string} Hora con formato HH:MM (parcial mientras escribe)
 */
export const maskTime = (text) => {
  const digits = String(text || '')
    .replace(/\D/g, '')
    .slice(0, 4);
  return digits.length <= 2 ? digits : `${digits.slice(0, 2)}:${digits.slice(2)}`;
};
