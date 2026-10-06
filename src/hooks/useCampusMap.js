import { useEffect, useMemo, useState } from 'react';
import { getPlan, getPlans } from '../api/campus.api';
import { getErrorMessage } from '../utils/error.utils';
import { loadPlanDetail, savePlanDetail } from '../utils/storage.utils';
import { matchesTerm } from '../utils/text.utils';
import useCachedResource from './useCachedResource';

const MIN_SEARCH_LENGTH = 2;
const MAX_RESULTS = 6;

/**
 * @description Consulta los planos del campus. Es una referencia estable para el hook con caché.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @returns {Promise<Array>} Planos sin imagen
 */
const fetchPlans = () => getPlans();

/**
 * @description Elige el mapa del campus entre los planos activos: el que trae malla de caminos o,
 *              si ninguno la trae, el que tiene más espacios ubicados.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {Array} plans - Planos del listado
 * @returns {Object|undefined} Plano del campus
 */
export const pickCampusPlan = (plans) =>
  plans.find((plan) => plan.navegacion) ||
  plans.slice().sort((a, b) => (b.espaciosDibujados || 0) - (a.espaciosDibujados || 0))[0];

/**
 * @description Hook que lista los planos del campus con caché local (funciona sin conexión).
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @returns {{ plans: Array, loading: boolean, error: string|null, refresh: Function }} Planos y estado
 */
export const usePlans = () => {
  const { data, loading, error, refresh } = useCachedResource('plans', fetchPlans);
  return { plans: data, loading, error, refresh };
};

/**
 * @description Hook que obtiene un plano completo (imagen y polígonos) primero desde el dispositivo y
 *              luego desde la API. Si la copia guardada tiene la misma fecha de actualización que el
 *              listado de planos, no vuelve a descargar la imagen. Sin conexión usa la copia guardada.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {string|null} planId - Plano a mostrar
 * @param {string|null} [updatedAt] - actualizadoEn del plano según el listado, para validar la copia
 * @returns {{ plan: Object|null, loading: boolean, error: string|null }} Plano, carga y error
 */
export const usePlanDetail = (planId, updatedAt) => {
  const [state, setState] = useState({ plan: null, loading: Boolean(planId), error: null });

  useEffect(() => {
    if (!planId) {
      setState({ plan: null, loading: false, error: null });
      return undefined;
    }
    let active = true;
    setState((previous) => ({
      plan: previous.plan && previous.plan.id === planId ? previous.plan : null,
      loading: true,
      error: null,
    }));

    (async () => {
      const stored = await loadPlanDetail(planId);
      if (!active) {
        return;
      }
      if (stored) {
        setState({ plan: stored, loading: false, error: null });
        if (updatedAt && stored.actualizadoEn === updatedAt) {
          return;
        }
      }
      try {
        const fresh = await getPlan(planId);
        if (!active) {
          return;
        }
        await savePlanDetail(fresh);
        setState({ plan: fresh, loading: false, error: null });
      } catch (error) {
        if (active && !stored) {
          setState({ plan: null, loading: false, error: getErrorMessage(error) });
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [planId, updatedAt]);

  return state;
};

/**
 * @description Busca, en el dispositivo y sin consultar la API, los espacios que ya tienen ubicación
 *              en algún plano. Ignora tildes y mayúsculas y funciona sin conexión.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {Array} spaces - Espacios en caché (incluyen planoId y geometria)
 * @param {string} query - Texto escrito por el estudiante
 * @returns {Array} Hasta seis espacios ubicados que coinciden por nombre o código
 */
export const useMappedSpaceSearch = (spaces, query) =>
  useMemo(() => {
    if (query.trim().length < MIN_SEARCH_LENGTH) {
      return [];
    }
    return spaces
      .filter((space) => space.planoId && space.geometria && matchesTerm(space, ['nombre', 'codigo'], query))
      .slice(0, MAX_RESULTS);
  }, [spaces, query]);
