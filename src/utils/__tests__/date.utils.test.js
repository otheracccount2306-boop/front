import {
  findNextClass,
  formatEventDateTime,
  formatLongDate,
  formatTimeRange,
  getDateBlock,
  getDayCode,
  getMonthRange,
  getWeekRange,
  isInCurrentWeek,
  isOpenNow,
  isWithinNextDays,
  parseHorario,
  parseIsoDate,
  toIsoDate,
} from '../date.utils';

const SUNDAY = new Date(2026, 8, 20, 12, 0);
const MONDAY = new Date(2026, 8, 21, 10, 0);

describe('fechas', () => {
  test('getDayCode devuelve el código del backend sin tildes', () => {
    expect(getDayCode(SUNDAY)).toBe('DOMINGO');
    expect(getDayCode(MONDAY)).toBe('LUNES');
    expect(getDayCode(new Date(2026, 8, 23))).toBe('MIERCOLES');
  });

  test('parseIsoDate y toIsoDate no desfasan la fecha por zona horaria', () => {
    expect(toIsoDate(parseIsoDate('2026-02-03'))).toBe('2026-02-03');
    expect(parseIsoDate('2026-09-25T17:35:00').getHours()).toBe(17);
  });

  test('formatea fechas y rangos horarios en español', () => {
    expect(formatEventDateTime('2026-09-25T17:35:00')).toBe('vie 25 sep · 17:35');
    expect(formatLongDate('2026-09-20T08:00:00')).toBe('20 sep 2026');
    expect(formatLongDate(null)).toBe('');
    expect(formatTimeRange('08:00:00', '10:00:00')).toBe('08:00 – 10:00');
    expect(getDateBlock('2026-02-03')).toEqual({ day: '03', month: 'feb' });
  });

  test('la semana va de lunes a domingo', () => {
    expect(getWeekRange(SUNDAY)).toEqual({ from: '2026-09-14', to: '2026-09-20' });
    expect(getWeekRange(MONDAY)).toEqual({ from: '2026-09-21', to: '2026-09-27' });
    expect(isInCurrentWeek('2026-09-20T23:00:00', SUNDAY)).toBe(true);
    expect(isInCurrentWeek('2026-09-21T09:00:00', SUNDAY)).toBe(false);
  });

  test('getMonthRange devuelve el primer y último día del mes', () => {
    expect(getMonthRange(SUNDAY)).toEqual({ from: '2026-09-01', to: '2026-09-30' });
    expect(getMonthRange(new Date(2026, 1, 10))).toEqual({ from: '2026-02-01', to: '2026-02-28' });
  });

  test('isWithinNextDays incluye hoy y excluye pasado y lejano', () => {
    expect(isWithinNextDays('2026-09-20', 7, SUNDAY)).toBe(true);
    expect(isWithinNextDays('2026-09-27', 7, SUNDAY)).toBe(true);
    expect(isWithinNextDays('2026-09-28', 7, SUNDAY)).toBe(false);
    expect(isWithinNextDays('2026-09-19', 7, SUNDAY)).toBe(false);
  });
});

describe('próxima clase', () => {
  const schedule = [
    { nombre: 'Tarde', dias: ['LUNES'], horaInicio: '14:00:00', horaFin: '16:00:00' },
    { nombre: 'Mañana', dias: ['LUNES', 'VIERNES'], horaInicio: '07:00:00', horaFin: '09:00:00' },
    { nombre: 'Martes', dias: ['MARTES'], horaInicio: '08:00:00', horaFin: '10:00:00' },
  ];

  test('antes de la primera clase devuelve la primera del día', () => {
    expect(findNextClass(schedule, new Date(2026, 8, 21, 6, 0)).nombre).toBe('Mañana');
  });

  test('durante una clase devuelve la que está en curso', () => {
    expect(findNextClass(schedule, new Date(2026, 8, 21, 8, 0)).nombre).toBe('Mañana');
  });

  test('entre clases devuelve la siguiente', () => {
    expect(findNextClass(schedule, new Date(2026, 8, 21, 10, 0)).nombre).toBe('Tarde');
  });

  test('sin más clases o en día sin clases devuelve null', () => {
    expect(findNextClass(schedule, new Date(2026, 8, 21, 17, 0))).toBeNull();
    expect(findNextClass(schedule, SUNDAY)).toBeNull();
  });
});

describe('horario de atención', () => {
  const at = (day, hours, minutes = 0) => new Date(2026, 8, 20 + day, hours, minutes);

  test('Lunes a Viernes 8:00 AM – 5:00 PM', () => {
    const text = 'Lunes a Viernes 8:00 AM – 5:00 PM';
    expect(isOpenNow(text, at(1, 10))).toBe(true);
    expect(isOpenNow(text, at(1, 7, 59))).toBe(false);
    expect(isOpenNow(text, at(1, 17))).toBe(false);
    expect(isOpenNow(text, at(5, 16, 59))).toBe(true);
    expect(isOpenNow(text, at(6, 10))).toBe(false);
    expect(isOpenNow(text, at(0, 10))).toBe(false);
  });

  test('lista de días: Martes y Jueves 2:00 PM – 6:00 PM', () => {
    const text = 'Martes y Jueves 2:00 PM – 6:00 PM';
    expect(isOpenNow(text, at(2, 15))).toBe(true);
    expect(isOpenNow(text, at(4, 15))).toBe(true);
    expect(isOpenNow(text, at(3, 15))).toBe(false);
  });

  test('varias franjas separadas por |', () => {
    const text = 'Lunes a Viernes 7:00 AM – 8:00 PM | Sábados 8:00 AM – 1:00 PM';
    expect(isOpenNow(text, at(6, 9))).toBe(true);
    expect(isOpenNow(text, at(6, 14))).toBe(false);
    expect(isOpenNow(text, at(3, 19))).toBe(true);
    expect(isOpenNow(text, at(0, 9))).toBe(false);
  });

  test('rango de días que cruza el fin de semana: Lunes a Sábado', () => {
    const text = 'Lunes a Sábado 6:00 AM – 8:00 PM';
    expect(isOpenNow(text, at(6, 7))).toBe(true);
    expect(isOpenNow(text, at(0, 7))).toBe(false);
  });

  test('horas sin AM/PM se interpretan como jornada diurna', () => {
    expect(parseHorario('Lunes a Viernes 8-5')).toEqual([{ days: [1, 2, 3, 4, 5], start: 480, end: 1020 }]);
  });

  test('texto que no se puede interpretar devuelve null', () => {
    expect(isOpenNow('Consultar en la oficina', at(1, 10))).toBeNull();
    expect(isOpenNow('', at(1, 10))).toBeNull();
    expect(isOpenNow(undefined, at(1, 10))).toBeNull();
  });
});
