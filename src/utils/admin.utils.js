import { categoryLabel } from './category.utils';
import { extractServerMessage, getErrorMessage } from './error.utils';
import { parseIsoDate, startOfDay, toIsoDate } from './date.utils';

const ADMIN_ERROR_OVERRIDES = {
  403: 'No tienes permisos para esta acción',
  404: 'El registro no existe o ya fue eliminado',
};

/**
 * @description Convierte códigos de categoría del backend en opciones de selector con etiqueta legible.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {string[]} values - Códigos de categoría
 * @returns {Array<{ value: string, label: string }>} Opciones para AdminFormSelect
 */
const optionsFrom = (values) => values.map((value) => ({ value, label: categoryLabel(value) }));

/**
 * @description Opciones de categoría de noticias.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 */
export const NEWS_CATEGORY_OPTIONS = optionsFrom(['INSTITUCIONAL', 'ACADEMICO', 'BIENESTAR']);

/**
 * @description Opciones de categoría de eventos institucionales.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 */
export const EVENT_CATEGORY_OPTIONS = optionsFrom(['ACADEMICO', 'INSTITUCIONAL', 'DEPORTE', 'CULTURA']);

/**
 * @description Opciones de categoría de servicios de bienestar.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 */
export const WELLBEING_CATEGORY_OPTIONS = optionsFrom(['PSICOLOGIA', 'SALUD', 'DEPORTE', 'CULTURA', 'PASTORAL', 'BECAS']);

/**
 * @description Opciones de categoría de espacios del campus.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 */
export const SPACE_CATEGORY_OPTIONS = optionsFrom([
  'AULA',
  'LABORATORIO',
  'OFICINA',
  'BIBLIOTECA',
  'CAFETERIA',
  'AREA_COMUN',
]);

/**
 * @description Opciones de categoría del calendario académico.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 */
export const CALENDAR_CATEGORY_OPTIONS = optionsFrom([
  'INICIO_CLASES',
  'EXAMENES',
  'RECESOS',
  'INSCRIPCIONES',
  'EVENTOS_ESPECIALES',
]);

/**
 * @description Días de clase disponibles al crear una asignatura, en orden de semana.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 */
export const SUBJECT_DAYS = [
  { value: 'LUNES', label: 'Lun' },
  { value: 'MARTES', label: 'Mar' },
  { value: 'MIERCOLES', label: 'Mié' },
  { value: 'JUEVES', label: 'Jue' },
  { value: 'VIERNES', label: 'Vie' },
  { value: 'SABADO', label: 'Sáb' },
];

/**
 * @description Tipos de servicio administrables con su etiqueta y el título del formulario.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 */
export const SERVICE_TYPES = [
  { name: 'wellbeing', label: 'Bienestar', singular: 'servicio de bienestar', feminine: false },
  { name: 'department', label: 'Directorio', singular: 'dependencia', feminine: true },
  { name: 'faq', label: 'FAQ', singular: 'pregunta frecuente', feminine: true },
];

/**
 * @description Traduce un error de la API a un mensaje en español para el panel de administración.
 *              Añade los mensajes de 403 y 404 acordados para el administrador.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Object} error - Error de Axios
 * @param {Object} overrides - Mensajes específicos por código HTTP
 * @returns {string} Mensaje para mostrar
 */
export const getAdminErrorMessage = (error, overrides = {}) =>
  getErrorMessage(error, { ...ADMIN_ERROR_OVERRIDES, ...overrides });

/**
 * @description Distingue si un 409 de una asignatura se debe a un conflicto de aula y horario o
 *              a un código repetido, según el mensaje del backend.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {Object} error - Error de Axios
 * @returns {string|null} Mensaje amigable para el 409, o null si el error no es un 409
 */
export const getSubjectConflictMessage = (error) => {
  if (!error || !error.response || error.response.status !== 409) {
    return null;
  }
  return /aula/i.test(extractServerMessage(error) || '')
    ? 'Ya existe una clase en esa aula en ese horario'
    : 'El código ya existe, usa uno diferente';
};

/**
 * @description Valida una hora escrita como HH:mm en formato de 24 horas.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {string} value - Hora escrita por el usuario
 * @returns {boolean} true si es una hora válida
 */
export const isValidTimeInput = (value) => /^([01]\d|2[0-3]):[0-5]\d$/.test(String(value || ''));

/**
 * @description Valida que un texto sea una URL http o https.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {string} value - Texto a validar
 * @returns {boolean} true si empieza con http:// o https:// y tiene contenido después
 */
export const isValidHttpUrl = (value) => /^https?:\/\/\S+$/.test(String(value || ''));

/**
 * @description Indica si una fecha escrita como YYYY-MM-DD es hoy o posterior.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {string} value - Fecha en formato YYYY-MM-DD
 * @param {Date} now - Fecha de referencia, hoy por defecto
 * @returns {boolean} true si la fecha no es anterior a hoy
 */
export const isTodayOrFuture = (value, now = new Date()) => startOfDay(parseIsoDate(value)) >= startOfDay(now);

/**
 * @description Separa una fecha-hora ISO en fecha (YYYY-MM-DD) y hora (HH:mm) para el formulario.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {string} iso - Fecha-hora ISO, por ejemplo 2026-09-25T17:35:00
 * @returns {{ date: string, time: string }} Fecha y hora, vacías si no hay valor
 */
export const splitDateTime = (iso) => {
  if (!iso) {
    return { date: '', time: '' };
  }
  const date = parseIsoDate(iso);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return { date: toIsoDate(date), time: `${hours}:${minutes}` };
};

/**
 * @description Une fecha y hora del formulario en el formato ISO que espera el backend.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {string} date - Fecha en formato YYYY-MM-DD
 * @param {string} time - Hora en formato HH:mm
 * @returns {string} Fecha-hora en formato YYYY-MM-DDTHH:mm:00
 */
export const joinDateTime = (date, time) => `${date}T${time}:00`;

/**
 * @description Convierte texto vacío en null para enviarlo al backend como campo opcional.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {string} value - Texto del formulario
 * @returns {string|null} Texto recortado, o null si está vacío
 */
export const emptyToNull = (value) => {
  const text = String(value || '').trim();
  return text === '' ? null : text;
};

/**
 * @description Formatea una lista de días como texto corto, por ejemplo "Lun, Mié".
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {string[]} days - Días en mayúsculas y sin tildes
 * @returns {string} Días abreviados separados por coma
 */
export const formatDays = (days) =>
  SUBJECT_DAYS.filter((day) => days.includes(day.value))
    .map((day) => day.label)
    .join(', ');
