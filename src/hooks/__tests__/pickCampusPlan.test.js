import { pickCampusPlan } from '../useCampusMap';

describe('pickCampusPlan', () => {
  test('prefiere el plano con malla de caminos', () => {
    const plans = [
      { id: 'a', espaciosDibujados: 90, navegacion: false },
      { id: 'campus', espaciosDibujados: 10, navegacion: true },
    ];
    expect(pickCampusPlan(plans).id).toBe('campus');
  });

  test('sin malla, elige el que tiene más espacios', () => {
    const plans = [
      { id: 'a', espaciosDibujados: 3 },
      { id: 'b', espaciosDibujados: 30 },
    ];
    expect(pickCampusPlan(plans).id).toBe('b');
    expect(pickCampusPlan([])).toBeUndefined();
  });
});
