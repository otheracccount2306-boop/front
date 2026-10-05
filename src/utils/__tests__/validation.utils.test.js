import {
  getPasswordChecks,
  getPasswordStrength,
  isInstitutionalEmail,
  isValidDateInput,
  isValidPassword,
  isValidPhone,
  validateRegisterForm,
} from '../validation.utils';

describe('validaciones', () => {
  test('correo institucional', () => {
    expect(isInstitutionalEmail('ana@campusucc.edu.co')).toBe(true);
    expect(isInstitutionalEmail('  ANA@UCC.EDU.CO ')).toBe(true);
    expect(isInstitutionalEmail('ana@gmail.com')).toBe(false);
    expect(isInstitutionalEmail('ana@campusucc.edu.co.malo.com')).toBe(false);
    expect(isInstitutionalEmail('@campusucc.edu.co')).toBe(false);
    expect(isInstitutionalEmail('')).toBe(false);
  });

  test('requisitos y fortaleza de la contraseña', () => {
    expect(getPasswordChecks('Clave#2026')).toEqual({ length: true, upper: true, number: true, special: true });
    expect(getPasswordStrength('')).toEqual({ score: 0, level: 'empty', label: '' });
    expect(getPasswordStrength('clave').level).toBe('weak');
    expect(getPasswordStrength('Clave2026').level).toBe('medium');
    expect(getPasswordStrength('Clave#2026').level).toBe('strong');
    expect(isValidPassword('Clave#2026')).toBe(true);
    expect(isValidPassword('clave#2026')).toBe(false);
    expect(isValidPassword('Clave#abcd')).toBe(false);
    expect(isValidPassword('Clave2026')).toBe(false);
    expect(isValidPassword('Cl#2026')).toBe(false);
  });

  test('teléfono opcional con el formato del backend', () => {
    expect(isValidPhone('')).toBe(true);
    expect(isValidPhone('3001234567')).toBe(true);
    expect(isValidPhone('+57 (605) 123-4567')).toBe(true);
    expect(isValidPhone('abc')).toBe(false);
    expect(isValidPhone('12345')).toBe(false);
  });

  test('fecha escrita a mano debe existir en el calendario', () => {
    expect(isValidDateInput('2026-02-28')).toBe(true);
    expect(isValidDateInput('2026-02-30')).toBe(false);
    expect(isValidDateInput('26-02-28')).toBe(false);
    expect(isValidDateInput('abc')).toBe(false);
  });

  test('formulario de registro completo', () => {
    const valid = {
      nombre: 'Ana',
      apellido: 'Pérez',
      correo: 'ana@campusucc.edu.co',
      programaAcademico: 'Ingeniería de Software',
      contrasena: 'Clave#2026',
      confirmacion: 'Clave#2026',
    };
    expect(validateRegisterForm(valid)).toEqual({});
    expect(Object.keys(validateRegisterForm({ ...valid, nombre: ' ', correo: 'x@y.com', confirmacion: 'otra' })).sort()).toEqual([
      'confirmacion',
      'correo',
      'nombre',
    ]);
    expect(validateRegisterForm({ ...valid, confirmacion: '' }).confirmacion).toBeDefined();
  });
});
