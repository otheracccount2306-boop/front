import {
  isPersonalClass,
  maskTime,
  personalClassValues,
  toPersonalClassPayload,
  validatePersonalClass,
} from '../personalClass.utils';

const valid = {
  nombre: 'Inglés',
  docente: '',
  aula: 'Aula 2 101',
  dias: ['LUNES'],
  horaInicio: '07:00',
  horaFin: '09:00',
};

describe('clases personales', () => {
  test('valida nombre, días y horas como el backend', () => {
    expect(validatePersonalClass(valid)).toEqual({});
    const errors = validatePersonalClass({ ...valid, nombre: ' ', dias: [], horaInicio: '7', horaFin: '06:00' });
    expect(Object.keys(errors).sort()).toEqual(['dias', 'horaInicio', 'nombre']);
    expect(validatePersonalClass({ ...valid, horaFin: '06:30' }).horaFin).toMatch(/después/);
  });

  test('arma el cuerpo de la API sin dueño y con horas completas', () => {
    expect(toPersonalClassPayload({ ...valid, nombre: '  Inglés ' })).toEqual({
      nombre: 'Inglés',
      docente: null,
      aula: 'Aula 2 101',
      dias: ['LUNES'],
      horaInicio: '07:00:00',
      horaFin: '09:00:00',
    });
  });

  test('carga una clase para editar y reconoce las personales', () => {
    const subject = { nombre: 'X', dias: ['MARTES'], horaInicio: '10:00:00', horaFin: '11:30:00', origen: 'PERSONAL' };
    expect(personalClassValues(subject)).toMatchObject({ dias: ['MARTES'], horaInicio: '10:00', horaFin: '11:30' });
    expect(personalClassValues(null, 'JUEVES').dias).toEqual(['JUEVES']);
    expect(isPersonalClass(subject)).toBe(true);
    expect(isPersonalClass({ origen: 'INSTITUCIONAL' })).toBe(false);
  });

  test('pone los dos puntos de la hora mientras se escribe', () => {
    expect(maskTime('14')).toBe('14');
    expect(maskTime('143')).toBe('14:3');
    expect(maskTime('14:305')).toBe('14:30');
    expect(maskTime('ab07c00')).toBe('07:00');
  });
});
