import colors from '../../../theme/colors';
import template from './campusMapTemplate.generated';

const CONFIG_MARKER = '/*__MAP_CONFIG__*/null';

/** Origen de los mensajes que la app envía al mapa; el mapa ignora cualquier otro. */
export const APP_MESSAGE_SOURCE = 'ucc-campus-app';

/** Origen de los mensajes que el mapa envía a la app. */
export const MAP_MESSAGE_SOURCE = 'ucc-campus-map';

/**
 * @description Serializa un valor para incrustarlo dentro de una etiqueta script sin que un texto
 *              como "</script>" o los separadores de línea U+2028/U+2029 rompan el HTML.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {any} value - Valor serializable
 * @returns {string} JSON seguro para un script en línea
 */
export const toScriptJson = (value) =>
  JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

/**
 * @description Arma el HTML autocontenido del mapa de un plano: Leaflet, la imagen del plano (data
 *              URL), los polígonos y los colores de la app. No necesita conexión para mostrarse.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {Object} plan - Plano con imagen, ancho, alto y espacios (respuesta de GET /campus/plans/{id})
 * @returns {string} Documento HTML para el WebView o el iframe
 */
export const buildMapHtml = (plan) => {
  const config = {
    plan: {
      id: plan.id,
      nombre: plan.nombre,
      imagen: plan.imagen,
      ancho: plan.ancho,
      alto: plan.alto,
      espacios: (plan.espacios || []).map((space) => ({
        id: space.id,
        nombre: space.nombre,
        codigo: space.codigo,
        categoria: space.categoria,
        geometria: space.geometria,
      })),
    },
    theme: {
      primary: colors.primary,
      light: colors.light,
      accent: colors.accent,
      background: colors.background,
      white: colors.white,
      gray1: colors.gray1,
      gray2: colors.gray2,
      gray4: colors.gray4,
    },
  };
  return template.replace(CONFIG_MARKER, () => toScriptJson(config));
};

/**
 * @description Interpreta un mensaje recibido desde el mapa.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {string|Object} raw - Texto JSON o el objeto ya deserializado
 * @returns {{ type: string, payload: Object }|null} Mensaje del mapa, o null si no viene del mapa
 */
export const parseMapMessage = (raw) => {
  let data = raw;
  if (typeof raw === 'string') {
    try {
      data = JSON.parse(raw);
    } catch {
      return null;
    }
  }
  if (!data || data.source !== MAP_MESSAGE_SOURCE || typeof data.type !== 'string') {
    return null;
  }
  return { type: data.type, payload: data.payload || {} };
};
