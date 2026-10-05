import { ALL_VALUE, buildChipsFromItems, categoryIcon, categoryLabel } from '../category.utils';
import { getContactAction } from '../contact.utils';
import { debounce } from '../debounce.utils';
import { getErrorMessage, toFriendlyError } from '../error.utils';
import { formatRemaining, getLoginLock, registerFailedAttempt, clearLoginLock } from '../loginLock.utils';
import { getInitials, matchesTerm, normalizeText } from '../text.utils';

const axiosError = (status, body) => ({
  isAxiosError: true,
  response: status ? { status, data: body } : undefined,
});

describe('texto', () => {
  test('normalizeText quita tildes y mayúsculas', () => {
    expect(normalizeText('  Tesorería Y Pagos ')).toBe('tesoreria y pagos');
    expect(normalizeText(null)).toBe('');
  });

  test('matchesTerm busca sin tildes en varios campos', () => {
    const item = { nombre: 'Carné estudiantil', descripcion: 'Trámites' };
    expect(matchesTerm(item, ['nombre'], 'CARNE')).toBe(true);
    expect(matchesTerm(item, ['nombre', 'descripcion'], 'tramites')).toBe(true);
    expect(matchesTerm(item, ['nombre'], 'zzz')).toBe(false);
    expect(matchesTerm(item, ['nombre'], '')).toBe(true);
  });

  test('getInitials', () => {
    expect(getInitials('juan', 'pérez')).toBe('JP');
    expect(getInitials('', '')).toBe('?');
  });
});

describe('categorías', () => {
  test('etiquetas e íconos', () => {
    expect(categoryLabel('AREA_COMUN')).toBe('Área común');
    expect(categoryLabel('OTRA_COSA')).toBe('Otra cosa');
    expect(categoryLabel(null)).toBe('');
    expect(categoryIcon('BIBLIOTECA')).toBe('library-outline');
    expect(categoryIcon('DESCONOCIDA')).toBe('ellipse-outline');
  });

  test('chips construidos desde los datos, únicos y ordenados', () => {
    const chips = buildChipsFromItems([{ categoria: 'PAGOS' }, { categoria: 'CAMPUS' }, { categoria: 'PAGOS' }], 'Todas');
    expect(chips.map((chip) => chip.value)).toEqual([ALL_VALUE, 'CAMPUS', 'PAGOS']);
    expect(chips[0].label).toBe('Todas');
  });
});

describe('contacto', () => {
  test('correo, teléfono, texto y vacío', () => {
    expect(getContactAction('bienestar@campusucc.edu.co')).toEqual({
      type: 'mail',
      label: 'bienestar@campusucc.edu.co',
      url: 'mailto:bienestar@campusucc.edu.co',
    });
    expect(getContactAction('Tel: (605) 431-2345').type).toBe('phone');
    expect(getContactAction('Tel: (605) 431-2345').url).toBe('tel:6054312345');
    expect(getContactAction('Ventanilla 3')).toEqual({ type: 'text', label: 'Ventanilla 3', url: null });
    expect(getContactAction('  ')).toBeNull();
  });
});

describe('errores', () => {
  test('sin conexión', () => {
    expect(getErrorMessage(axiosError(null))).toMatch(/No se pudo conectar/);
  });

  test('errores que no son de red', () => {
    expect(getErrorMessage(new Error('boom'))).toMatch(/inesperado/);
  });

  test('códigos HTTP con mensajes amigables', () => {
    expect(getErrorMessage(axiosError(403, {}))).toMatch(/permisos/);
    expect(getErrorMessage(axiosError(404, {}))).toMatch(/No encontramos/);
    expect(getErrorMessage(axiosError(500, {}))).toMatch(/servidor/);
  });

  test('conserva el mensaje de negocio en 400 y 422, en formato message o error', () => {
    expect(getErrorMessage(axiosError(422, { message: 'Debe aceptar el tratamiento de datos' }))).toBe(
      'Debe aceptar el tratamiento de datos',
    );
    expect(getErrorMessage(axiosError(400, { error: 'La página debe ser mayor o igual a 1' }))).toBe(
      'La página debe ser mayor o igual a 1',
    );
  });

  test('no muestra mensajes técnicos del backend', () => {
    expect(getErrorMessage(axiosError(400, { message: 'Datos de entrada inválidos' }))).toBe(
      'Revisa los datos ingresados e intenta de nuevo.',
    );
  });

  test('los mensajes específicos por código tienen prioridad', () => {
    expect(getErrorMessage(axiosError(409, { message: 'x' }), { 409: 'El correo ya está registrado' })).toBe(
      'El correo ya está registrado',
    );
  });

  test('toFriendlyError conserva el código y no se vuelve a traducir', () => {
    const friendly = toFriendlyError(axiosError(401, {}), { 401: 'Credenciales incorrectas' });
    expect(friendly.message).toBe('Credenciales incorrectas');
    expect(friendly.status).toBe(401);
    expect(getErrorMessage(friendly)).toBe('Credenciales incorrectas');
  });
});

describe('debounce', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  test('solo ejecuta la última llamada tras 300 ms', () => {
    const spy = jest.fn();
    const debounced = debounce(spy, 300);
    debounced('a');
    debounced('ab');
    debounced('abc');
    jest.advanceTimersByTime(299);
    expect(spy).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('abc');
  });

  test('cancel evita la ejecución pendiente', () => {
    const spy = jest.fn();
    const debounced = debounce(spy, 300);
    debounced('a');
    debounced.cancel();
    jest.advanceTimersByTime(500);
    expect(spy).not.toHaveBeenCalled();
  });
});

describe('bloqueo aproximado de login', () => {
  beforeEach(() => clearLoginLock());

  test('bloquea por 15 minutos al quinto fallo con el mismo correo', async () => {
    const now = 1_000_000;
    let record;
    for (let attempt = 1; attempt <= 4; attempt += 1) {
      record = await registerFailedAttempt('Ana@campusucc.edu.co', now);
      expect(record.lockedUntil).toBeNull();
      expect(record.count).toBe(attempt);
    }
    record = await registerFailedAttempt('ana@campusucc.edu.co', now);
    expect(record.lockedUntil).toBe(now + 15 * 60 * 1000);
    expect(await getLoginLock()).toEqual(record);
  });

  test('cambiar de correo reinicia el conteo', async () => {
    await registerFailedAttempt('a@campusucc.edu.co');
    await registerFailedAttempt('a@campusucc.edu.co');
    const record = await registerFailedAttempt('b@campusucc.edu.co');
    expect(record.count).toBe(1);
  });

  test('formatRemaining', () => {
    expect(formatRemaining(15 * 60 * 1000)).toBe('15:00');
    expect(formatRemaining(61_000)).toBe('01:01');
    expect(formatRemaining(-5)).toBe('00:00');
  });
});
