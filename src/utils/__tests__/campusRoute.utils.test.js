import { routeSummary } from '../campusRoute.utils';

describe('routeSummary', () => {
  test('sin resumen devuelve null', () => {
    expect(routeSummary(null)).toBeNull();
  });

  test('camino en el primer piso: solo tiempo y distancia', () => {
    expect(routeSummary({ minutos: 3, distancia: 180, piso: '1', escaleras: 0 })).toEqual({
      main: '3 min caminando · 180 m',
      steps: null,
      note: null,
    });
  });

  test('camino a un piso alto indica la escalera', () => {
    const summary = routeSummary({ minutos: 4, distancia: 210, piso: '3', escaleras: 2 });
    expect(summary.steps).toBe('Sube al piso 3 por la escalera marcada en el mapa');
  });

  test('un piso alto sin cambio de piso (bloque a nivel de la calle) no pide subir', () => {
    expect(routeSummary({ minutos: 2, distancia: 90, piso: '2', escaleras: 0 }).steps).toBeNull();
  });

  test('camino aproximado agrega el aviso', () => {
    expect(routeSummary({ minutos: 2, distancia: 90, piso: '1', escaleras: 0, aproximado: true }).note).toMatch(
      /lo más cerca posible/,
    );
  });
});
