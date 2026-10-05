import { normalizeText } from './text.utils';

const DAY_CODES = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
const MONTHS_SHORT = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const WEEKDAYS_SHORT = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
const DAY_INDEX = { domingo: 0, lunes: 1, martes: 2, miercoles: 3, jueves: 4, viernes: 5, sabado: 6 };
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];
const DAY_WORD = '(lunes|martes|miercoles|jueves|viernes|sabados?|domingos?)';
const DAY_RANGE_REGEX = new RegExp(`${DAY_WORD}\\s+a\\s+${DAY_WORD}`);
const DAY_WORD_REGEX = new RegExp(DAY_WORD, 'g');
const TIME_RANGE_REGEX = /(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\s*[-–—]\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/;

/**
 * @description Devuelve el código de día usado por el backend (LUNES, MARTES, ...) para una fecha.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Date} date - Fecha a evaluar, hoy por defecto
 * @returns {string} Código de día en mayúsculas y sin tildes
 */
export const getDayCode = (date = new Date()) => DAY_CODES[date.getDay()];

/**
 * @description Convierte una fecha ISO (con o sin hora) en un Date local sin desfase de zona horaria.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {string} iso - Fecha en formato YYYY-MM-DD o YYYY-MM-DDTHH:mm:ss
 * @returns {Date} Fecha local
 */
export const parseIsoDate = (iso) => {
  const [datePart, timePart] = String(iso).split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  if (!timePart) {
    return new Date(year, month - 1, day);
  }
  const [hours, minutes] = timePart.split(':').map(Number);
  return new Date(year, month - 1, day, hours || 0, minutes || 0);
};

/**
 * @description Formatea una fecha local como YYYY-MM-DD.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Date} date - Fecha a formatear
 * @returns {string} Fecha en formato ISO de solo día
 */
export const toIsoDate = (date) => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};

/**
 * @description Devuelve el inicio del día (00:00) de una fecha.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Date} date - Fecha original
 * @returns {Date} Nueva fecha a las 00:00
 */
export const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

/**
 * @description Suma días a una fecha sin modificar la original.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Date} date - Fecha original
 * @param {number} days - Días a sumar, puede ser negativo
 * @returns {Date} Nueva fecha
 */
export const addDays = (date, days) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

/**
 * @description Recorta una hora HH:mm:ss a HH:mm.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {string} time - Hora en formato HH:mm o HH:mm:ss
 * @returns {string} Hora en formato HH:mm
 */
export const formatTime = (time) => String(time || '').slice(0, 5);

/**
 * @description Formatea un rango horario como "08:00 – 10:00".
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {string} start - Hora de inicio
 * @param {string} end - Hora de fin
 * @returns {string} Rango horario legible
 */
export const formatTimeRange = (start, end) => `${formatTime(start)} – ${formatTime(end)}`;

/**
 * @description Separa una fecha en día numérico y mes abreviado para el bloque de fecha.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {string} iso - Fecha en formato ISO
 * @returns {{ day: string, month: string }} Día con dos dígitos y mes abreviado en español
 */
export const getDateBlock = (iso) => {
  const date = parseIsoDate(iso);
  return { day: String(date.getDate()).padStart(2, '0'), month: MONTHS_SHORT[date.getMonth()] };
};

/**
 * @description Formatea una fecha como "25 sep 2026".
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {string} iso - Fecha o fecha-hora en formato ISO
 * @returns {string} Fecha legible, o cadena vacía si no hay valor
 */
export const formatLongDate = (iso) => {
  if (!iso) {
    return '';
  }
  const date = parseIsoDate(iso);
  return `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]} ${date.getFullYear()}`;
};

/**
 * @description Formatea la fecha y hora de un evento como "vie 25 sep · 10:00".
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {string} iso - Fecha-hora en formato ISO
 * @returns {string} Fecha y hora legibles
 */
export const formatEventDateTime = (iso) => {
  const date = parseIsoDate(iso);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${WEEKDAYS_SHORT[date.getDay()]} ${date.getDate()} ${MONTHS_SHORT[date.getMonth()]} · ${hours}:${minutes}`;
};

/**
 * @description Indica si una fecha cae dentro de los próximos N días contando desde hoy.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {string} iso - Fecha en formato ISO
 * @param {number} days - Cantidad de días hacia adelante
 * @param {Date} now - Fecha de referencia, hoy por defecto
 * @returns {boolean} true si la fecha es hoy o cae dentro del rango
 */
export const isWithinNextDays = (iso, days, now = new Date()) => {
  const target = startOfDay(parseIsoDate(iso));
  const from = startOfDay(now);
  return target >= from && target <= addDays(from, days);
};

/**
 * @description Calcula el rango de la semana en curso, de lunes a domingo.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Date} now - Fecha de referencia, hoy por defecto
 * @returns {{ from: string, to: string }} Lunes y domingo en formato YYYY-MM-DD
 */
export const getWeekRange = (now = new Date()) => {
  const offset = (now.getDay() + 6) % 7;
  const monday = addDays(startOfDay(now), -offset);
  return { from: toIsoDate(monday), to: toIsoDate(addDays(monday, 6)) };
};

/**
 * @description Calcula el rango del mes en curso.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Date} now - Fecha de referencia, hoy por defecto
 * @returns {{ from: string, to: string }} Primer y último día del mes en formato YYYY-MM-DD
 */
export const getMonthRange = (now = new Date()) => ({
  from: toIsoDate(new Date(now.getFullYear(), now.getMonth(), 1)),
  to: toIsoDate(new Date(now.getFullYear(), now.getMonth() + 1, 0)),
});

/**
 * @description Indica si una fecha pertenece a la semana en curso (lunes a domingo).
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {string} iso - Fecha o fecha-hora en formato ISO
 * @param {Date} now - Fecha de referencia, hoy por defecto
 * @returns {boolean} true si la fecha está en la semana actual
 */
export const isInCurrentWeek = (iso, now = new Date()) => {
  const { from, to } = getWeekRange(now);
  const day = toIsoDate(parseIsoDate(iso));
  return day >= from && day <= to;
};

/**
 * @description Convierte una hora HH:mm o HH:mm:ss en minutos desde la medianoche.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {string} time - Hora en formato HH:mm o HH:mm:ss
 * @returns {number} Minutos desde las 00:00
 */
const toMinutes = (time) => {
  const [hours, minutes] = String(time).split(':').map(Number);
  return hours * 60 + (minutes || 0);
};

/**
 * @description Busca la clase más próxima del día: la que está en curso o la siguiente que empieza.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {Array} schedule - Asignaturas del horario del estudiante
 * @param {Date} now - Fecha y hora de referencia, ahora por defecto
 * @returns {Object|null} Asignatura encontrada o null si no quedan clases hoy
 */
export const findNextClass = (schedule, now = new Date()) => {
  const today = getDayCode(now);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  return (
    schedule
      .filter((subject) => subject.dias.includes(today))
      .sort((a, b) => toMinutes(a.horaInicio) - toMinutes(b.horaInicio))
      .find((subject) => toMinutes(subject.horaFin) > nowMinutes) || null
  );
};

/**
 * @description Convierte una hora de 12 horas con AM/PM opcional en minutos desde la medianoche.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {string} hourText - Hora escrita, por ejemplo "5"
 * @param {string|undefined} minuteText - Minutos escritos, por ejemplo "30"
 * @param {'am'|'pm'|undefined} meridiem - Indicador AM o PM
 * @returns {number} Minutos desde las 00:00
 */
const toMinutes24 = (hourText, minuteText, meridiem) => {
  let hours = parseInt(hourText, 10);
  if (meridiem === 'pm' && hours < 12) {
    hours += 12;
  }
  if (meridiem === 'am' && hours === 12) {
    hours = 0;
  }
  return hours * 60 + (minuteText ? parseInt(minuteText, 10) : 0);
};

/**
 * @description Convierte un nombre de día (ya normalizado) en su índice de JavaScript, aceptando
 *              los plurales "sábados" y "domingos".
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {string} word - Nombre del día en minúsculas y sin tildes
 * @returns {number} Índice del día, 0 para domingo
 */
const dayIndexOf = (word) => DAY_INDEX[word.replace(/^(sabado|domingo)s$/, '$1')];

/**
 * @description Obtiene los días de la semana que menciona un texto de horario, ya sea un rango
 *              ("lunes a viernes"), una lista ("martes y jueves") o un día suelto. Sin días
 *              mencionados asume todos.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {string} daysText - Parte del horario anterior a las horas, normalizada
 * @returns {number[]} Índices de día de JavaScript, 0 para domingo
 */
const expandDays = (daysText) => {
  const range = daysText.match(DAY_RANGE_REGEX);
  if (range) {
    const startIndex = WEEK_ORDER.indexOf(dayIndexOf(range[1]));
    const endIndex = WEEK_ORDER.indexOf(dayIndexOf(range[2]));
    const days = [];
    for (let step = startIndex; ; step = (step + 1) % 7) {
      days.push(WEEK_ORDER[step]);
      if (step === endIndex) {
        return days;
      }
    }
  }
  const named = (daysText.match(DAY_WORD_REGEX) || []).map(dayIndexOf);
  return named.length > 0 ? named : [0, 1, 2, 3, 4, 5, 6];
};

/**
 * @description Interpreta un horario de atención escrito en texto libre, por ejemplo
 *              "Lunes a Viernes 8:00 AM – 5:00 PM | Sábados 8:00 AM – 1:00 PM".
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {string} horario - Texto del horario de atención
 * @returns {Array<{ days: number[], start: number, end: number }>|null} Franjas con días
 *          (0 = domingo) y minutos desde medianoche, o null si el texto no se puede interpretar
 */
export const parseHorario = (horario) => {
  const segments = normalizeText(horario)
    .split(/[|;]/)
    .map((segment) => {
      const match = segment.match(TIME_RANGE_REGEX);
      if (!match) {
        return null;
      }
      const endMeridiem = match[6];
      const startMeridiem = match[3] || endMeridiem;
      let start = toMinutes24(match[1], match[2], startMeridiem);
      let end = toMinutes24(match[4], match[5], endMeridiem);
      if (start > end && !match[3]) {
        start = toMinutes24(match[1], match[2], 'am');
      }
      if (end <= start && !endMeridiem) {
        end += 12 * 60;
      }
      return { days: expandDays(segment.slice(0, match.index)), start, end };
    })
    .filter(Boolean);
  return segments.length > 0 ? segments : null;
};

/**
 * @description Indica si una dependencia o servicio está abierto en este momento según su
 *              horario de atención, comparando con la hora local del dispositivo.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {string} horario - Texto del horario de atención
 * @param {Date} now - Fecha y hora de referencia, ahora por defecto
 * @returns {boolean|null} true si está abierto, false si está cerrado, null si el horario no se puede interpretar
 */
export const isOpenNow = (horario, now = new Date()) => {
  const segments = parseHorario(horario);
  if (!segments) {
    return null;
  }
  const minutes = now.getHours() * 60 + now.getMinutes();
  return segments.some(
    (segment) => segment.days.includes(now.getDay()) && minutes >= segment.start && minutes < segment.end,
  );
};
