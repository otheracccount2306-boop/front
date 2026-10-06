import colors from '../../../theme/colors';
import template from './campusMapTemplate.generated';

const CONFIG_MARKER = '/*__MAP_CONFIG__*/null';

export const APP_MESSAGE_SOURCE = 'ucc-campus-app';

export const MAP_MESSAGE_SOURCE = 'ucc-campus-map';

export const toScriptJson = (value) =>
  JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

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
        edificio: space.edificio || null,
        piso: space.piso || null,
        geometria: space.geometria,
      })),
      navegacion: plan.navegacion || null,
    },
    theme: {
      primary: colors.primary,
      primaryDark: colors.primaryDark,
      aqua: colors.aqua,
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
