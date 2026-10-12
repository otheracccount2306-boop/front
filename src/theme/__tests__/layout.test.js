import { getLayout } from '../layout';

describe('getLayout (mobile first)', () => {
  test('en el celular ocupa todo el ancho, una columna y sin menú lateral', () => {
    const layout = getLayout(390, true);
    expect(layout.size).toBe('compact');
    expect(layout.contentMaxWidth).toBeNull();
    expect(layout.sidebar).toBe(false);
    expect(layout.columns()).toBe(1);
  });

  test('en tableta centra el contenido y pasa a dos columnas', () => {
    const layout = getLayout(820, true);
    expect(layout.size).toBe('medium');
    expect(layout.sidebar).toBe(false);
    expect(layout.columns()).toBe(2);
  });

  test('en computador usa el menú lateral (solo en web) y hasta tres columnas', () => {
    expect(getLayout(1440, true).sidebar).toBe(true);
    expect(getLayout(1440, false).sidebar).toBe(false);
    expect(getLayout(1440, true).columns()).toBe(3);
    expect(getLayout(1440, true).columns(340, 2)).toBe(2);
  });
});
