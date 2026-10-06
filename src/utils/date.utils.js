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

export const getDayCode = (date = new Date()) => DAY_CODES[date.getDay()];

export const parseIsoDate = (iso) => {
  const [datePart, timePart] = String(iso).split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  if (!timePart) {
    return new Date(year, month - 1, day);
  }
  const [hours, minutes] = timePart.split(':').map(Number);
  return new Date(year, month - 1, day, hours || 0, minutes || 0);
};

export const toIsoDate = (date) => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};

export const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const addDays = (date, days) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

export const formatTime = (time) => String(time || '').slice(0, 5);

export const formatTimeRange = (start, end) => `${formatTime(start)} – ${formatTime(end)}`;

export const getDateBlock = (iso) => {
  const date = parseIsoDate(iso);
  return { day: String(date.getDate()).padStart(2, '0'), month: MONTHS_SHORT[date.getMonth()] };
};

export const formatLongDate = (iso) => {
  if (!iso) {
    return '';
  }
  const date = parseIsoDate(iso);
  return `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]} ${date.getFullYear()}`;
};

export const formatEventDateTime = (iso) => {
  const date = parseIsoDate(iso);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${WEEKDAYS_SHORT[date.getDay()]} ${date.getDate()} ${MONTHS_SHORT[date.getMonth()]} · ${hours}:${minutes}`;
};

export const isWithinNextDays = (iso, days, now = new Date()) => {
  const target = startOfDay(parseIsoDate(iso));
  const from = startOfDay(now);
  return target >= from && target <= addDays(from, days);
};

export const getWeekRange = (now = new Date()) => {
  const offset = (now.getDay() + 6) % 7;
  const monday = addDays(startOfDay(now), -offset);
  return { from: toIsoDate(monday), to: toIsoDate(addDays(monday, 6)) };
};

export const getMonthRange = (now = new Date()) => ({
  from: toIsoDate(new Date(now.getFullYear(), now.getMonth(), 1)),
  to: toIsoDate(new Date(now.getFullYear(), now.getMonth() + 1, 0)),
});

export const isInCurrentWeek = (iso, now = new Date()) => {
  const { from, to } = getWeekRange(now);
  const day = toIsoDate(parseIsoDate(iso));
  return day >= from && day <= to;
};

const toMinutes = (time) => {
  const [hours, minutes] = String(time).split(':').map(Number);
  return hours * 60 + (minutes || 0);
};

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

const dayIndexOf = (word) => DAY_INDEX[word.replace(/^(sabado|domingo)s$/, '$1')];

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
