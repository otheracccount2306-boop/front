import { categoryLabel } from './category.utils';
import { extractServerMessage, getErrorMessage } from './error.utils';
import { parseIsoDate, startOfDay, toIsoDate } from './date.utils';

const ADMIN_ERROR_OVERRIDES = {
  403: 'No tienes permisos para esta acción',
  404: 'El registro no existe o ya fue eliminado',
};

const optionsFrom = (values) => values.map((value) => ({ value, label: categoryLabel(value) }));

export const NEWS_CATEGORY_OPTIONS = optionsFrom(['INSTITUCIONAL', 'ACADEMICO', 'BIENESTAR']);

export const EVENT_CATEGORY_OPTIONS = optionsFrom(['ACADEMICO', 'INSTITUCIONAL', 'DEPORTE', 'CULTURA']);

export const WELLBEING_CATEGORY_OPTIONS = optionsFrom(['PSICOLOGIA', 'SALUD', 'DEPORTE', 'CULTURA', 'PASTORAL', 'BECAS']);

export const SPACE_CATEGORY_OPTIONS = optionsFrom([
  'AULA',
  'LABORATORIO',
  'OFICINA',
  'BIBLIOTECA',
  'CAFETERIA',
  'AREA_COMUN',
]);

export const ADMIN_SPACES_TABS = [
  { name: 'SpacesManagement', label: 'Espacios' },
  { name: 'PlansManagement', label: 'Planos' },
];

export const CALENDAR_CATEGORY_OPTIONS = optionsFrom([
  'INICIO_CLASES',
  'EXAMENES',
  'RECESOS',
  'INSCRIPCIONES',
  'EVENTOS_ESPECIALES',
]);

export const SUBJECT_DAYS = [
  { value: 'LUNES', label: 'Lun' },
  { value: 'MARTES', label: 'Mar' },
  { value: 'MIERCOLES', label: 'Mié' },
  { value: 'JUEVES', label: 'Jue' },
  { value: 'VIERNES', label: 'Vie' },
  { value: 'SABADO', label: 'Sáb' },
];

export const SERVICE_TYPES = [
  { name: 'wellbeing', label: 'Bienestar', singular: 'servicio de bienestar', feminine: false },
  { name: 'department', label: 'Directorio', singular: 'dependencia', feminine: true },
  { name: 'faq', label: 'FAQ', singular: 'pregunta frecuente', feminine: true },
];

export const getAdminErrorMessage = (error, overrides = {}) =>
  getErrorMessage(error, { ...ADMIN_ERROR_OVERRIDES, ...overrides });

export const getSubjectConflictMessage = (error) => {
  if (!error || !error.response || error.response.status !== 409) {
    return null;
  }
  return /aula/i.test(extractServerMessage(error) || '')
    ? 'Ya existe una clase en esa aula en ese horario'
    : 'El código ya existe, usa uno diferente';
};

export const isValidTimeInput = (value) => /^([01]\d|2[0-3]):[0-5]\d$/.test(String(value || ''));

export const isValidHttpUrl = (value) => /^https?:\/\/\S+$/.test(String(value || ''));

export const isTodayOrFuture = (value, now = new Date()) => startOfDay(parseIsoDate(value)) >= startOfDay(now);

export const splitDateTime = (iso) => {
  if (!iso) {
    return { date: '', time: '' };
  }
  const date = parseIsoDate(iso);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return { date: toIsoDate(date), time: `${hours}:${minutes}` };
};

export const joinDateTime = (date, time) => `${date}T${time}:00`;

export const emptyToNull = (value) => {
  const text = String(value || '').trim();
  return text === '' ? null : text;
};

export const formatDays = (days) =>
  SUBJECT_DAYS.filter((day) => days.includes(day.value))
    .map((day) => day.label)
    .join(', ');

export const matchesPlanName = (typed, name) =>
  Boolean(typed && name) && typed.trim().toLocaleLowerCase('es') === name.trim().toLocaleLowerCase('es');
