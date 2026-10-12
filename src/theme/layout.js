import { createContext, useContext } from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import { spacing } from './typography';

/**
 * @description Puntos de quiebre del diseño, pensado primero para el celular (mobile first):
 *              por debajo de `medium` es un teléfono; desde `medium`, una tableta o una ventana
 *              angosta; desde `expanded`, una tableta horizontal o un computador.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 */
export const BREAKPOINTS = {
  medium: 600,
  expanded: 1024,
};

/** Ancho en puntos del menú lateral de la versión web. */
export const SIDEBAR_WIDTH = 220;

/** Desde este ancho la versión web cambia la barra inferior por el menú lateral. */
export const SIDEBAR_MIN_WIDTH = BREAKPOINTS.expanded;

/** Ancho máximo del contenido según el tamaño de pantalla; en el celular ocupa todo el ancho. */
const CONTENT_MAX_WIDTH = {
  compact: null,
  medium: 840,
  expanded: 1200,
};

/** Relleno lateral extra del cuerpo; las tarjetas ya traen su propio margen de 16. */
const BODY_PADDING = {
  compact: 0,
  medium: spacing.sm,
  expanded: spacing.lg,
};

/**
 * @description Calcula el diseño para un ancho de ventana. Es una función pura para poder probarla.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {number} width - Ancho de la ventana en puntos
 * @param {boolean} [isWeb] - Si corre en el navegador (el menú lateral solo existe en web)
 * @returns {{ size: 'compact'|'medium'|'expanded', isCompact: boolean, isExpanded: boolean,
 *            sidebar: boolean, contentWidth: number, contentMaxWidth: number|null,
 *            bodyPadding: number, columns: Function }} Diseño
 */
export const getLayout = (width, isWeb = Platform.OS === 'web') => {
  let size = 'compact';
  if (width >= BREAKPOINTS.expanded) {
    size = 'expanded';
  } else if (width >= BREAKPOINTS.medium) {
    size = 'medium';
  }
  const sidebar = isWeb && size === 'expanded';
  const available = sidebar ? width - SIDEBAR_WIDTH : width;
  const contentMaxWidth = CONTENT_MAX_WIDTH[size];
  const bodyPadding = BODY_PADDING[size];
  const contentWidth = Math.min(available, contentMaxWidth || available) - bodyPadding * 2;
  return {
    size,
    isCompact: size === 'compact',
    isExpanded: size === 'expanded',
    sidebar,
    contentWidth,
    contentMaxWidth,
    bodyPadding,
    /**
     * @description Columnas que caben para tarjetas de un ancho mínimo dado.
     * @param {number} [minItemWidth] - Ancho mínimo de cada tarjeta en puntos
     * @param {number} [max] - Máximo de columnas
     * @returns {number} Columnas, al menos 1
     */
    columns: (minItemWidth = 340, max = 3) =>
      size === 'compact' ? 1 : Math.max(1, Math.min(max, Math.floor(contentWidth / minItemWidth))),
  };
};

/**
 * @description Hook con el diseño de la ventana actual; se recalcula al girar el teléfono o al
 *              cambiar el tamaño del navegador.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @returns {ReturnType<typeof getLayout>} Diseño actual
 */
export const useLayout = () => {
  const { width } = useWindowDimensions();
  return getLayout(width);
};

/**
 * @description Indica a las tarjetas si están dentro de una rejilla de varias columnas, para que
 *              reduzcan su margen lateral y el espacio entre columnas quede parejo.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 */
export const GridContext = createContext(false);

/**
 * @description Margen lateral que debe usar una tarjeta de lista: 16 en una sola columna y 8 en
 *              rejilla (8 + 8 entre columnas = 16).
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @returns {number} Margen lateral en puntos
 */
export const useCardGutter = () => (useContext(GridContext) ? spacing.sm : spacing.lg);
