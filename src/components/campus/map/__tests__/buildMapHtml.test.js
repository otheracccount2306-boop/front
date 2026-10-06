import { buildMapHtml, parseMapMessage, toScriptJson } from '../buildMapHtml';

const plan = {
  id: 'p-1',
  nombre: 'Bloque C · Piso 1',
  imagen: 'data:image/png;base64,AAAA',
  ancho: 1200,
  alto: 800,
  navegacion: { version: 1, celdaPx: 5, ancho: 4, alto: 2, malla: '2,4,2', pxPorMetro: 10, entradas: [] },
  espacios: [
    {
      id: '11111111-1111-1111-1111-111111111111',
      nombre: 'Laboratorio </script><script>alert(1)</script>',
      codigo: 'LAB-101',
      categoria: 'LABORATORIO',
      edificio: 'Bloque 3',
      piso: '2',
      activo: true,
      geometria: {
        type: 'Polygon',
        coordinates: [
          [
            [40, 440],
            [400, 440],
            [400, 760],
            [40, 760],
            [40, 440],
          ],
        ],
      },
    },
  ],
};

/**
 * @description Extrae la configuración incrustada en el HTML del mapa.
 * @param {string} html - Documento generado
 * @returns {Object} Configuración del mapa
 */
const readConfig = (html) => {
  const match = html.match(/var CONFIG = (\{.*?\});\n/s);
  return JSON.parse(match[1]);
};

describe('buildMapHtml', () => {
  test('incrusta Leaflet, L.CRS.Simple y las funciones globales del mapa', () => {
    const html = buildMapHtml(plan);
    expect(html).toContain('L.CRS.Simple');
    expect(html).toContain('window.highlightSpace = function');
    expect(html).toContain('window.routeTo = function');
    expect(html).toContain('window.showFloor = function');
    expect(html).not.toContain('__LEAFLET_');
    expect(html).not.toContain('/*__MAP_CONFIG__*/');
    // Leaflet va incrustado: no hay ningún recurso remoto.
    expect(html).not.toMatch(/<script[^>]+src=/);
    expect(html).not.toMatch(/<(script|link|img)[^>]+(src|href)=["']https?:|url\(["']?https?:/);
  });

  test('envía el plano, los salones con su piso, la malla de caminos y los colores de la app', () => {
    const config = readConfig(buildMapHtml(plan));
    expect(config.plan).toMatchObject({ id: 'p-1', ancho: 1200, alto: 800, imagen: plan.imagen });
    expect(config.plan.espacios[0]).toEqual({
      id: plan.espacios[0].id,
      nombre: plan.espacios[0].nombre,
      codigo: 'LAB-101',
      categoria: 'LABORATORIO',
      edificio: 'Bloque 3',
      piso: '2',
      geometria: plan.espacios[0].geometria,
    });
    expect(config.plan.navegacion).toEqual(plan.navegacion);
    expect(config.theme.primary).toBe('#007760');
  });

  test('un nombre con </script> no puede cerrar la etiqueta del script', () => {
    const html = buildMapHtml(plan);
    expect(html).not.toContain('</script><script>alert(1)');
    expect(toScriptJson({ a: '</script>\u2028' })).toBe('{"a":"\\u003c/script>\\u2028"}');
  });
});

describe('fondo vectorial', () => {
  test('sin imagen pasa el lote y los bloques al mapa, que dibuja el fondo en vez del plano', () => {
    const base = {
      perimetro: [[0, 0], [1200, 0], [1200, 800]],
      edificios: [{ nombre: 'Bloque 3', anillos: [], etiqueta: [10, 10] }],
    };
    const html = buildMapHtml({ ...plan, imagen: null, navegacion: { ...plan.navegacion, base } });
    const config = readConfig(html);
    expect(config.plan.imagen).toBeNull();
    expect(config.plan.navegacion.base).toEqual(base);
    expect(html).toContain('drawBase(plan.navegacion.base)');
  });
});

describe('parseMapMessage', () => {
  test('acepta solo mensajes del mapa', () => {
    expect(parseMapMessage('{"source":"ucc-campus-map","type":"ready","payload":{"spaces":3}}')).toEqual({
      type: 'ready',
      payload: { spaces: 3 },
    });
    expect(parseMapMessage({ source: 'ucc-campus-map', type: 'spacePress', payload: { id: 'x' } })).toEqual({
      type: 'spacePress',
      payload: { id: 'x' },
    });
    expect(parseMapMessage('{"source":"otra-cosa","type":"ready"}')).toBeNull();
    expect(parseMapMessage('no es json')).toBeNull();
  });
});
