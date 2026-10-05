import { useEffect, useMemo, useState } from 'react';
import { getSpaces, searchSpaces } from '../api/campus.api';
import useCachedResource from './useCachedResource';
import { ALL_VALUE } from '../utils/category.utils';
import { useDebouncedValue } from '../utils/debounce.utils';
import { getErrorMessage } from '../utils/error.utils';

const MIN_SEARCH_LENGTH = 2;
/**
 * @description Consulta todos los espacios sin filtros; el filtrado por categoría se hace en el
 *              dispositivo. Es una referencia estable para el hook con caché.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @returns {Promise<Array>} Espacios del campus
 */
const fetchAllSpaces = () => getSpaces();

/**
 * @description Hook que obtiene y cachea los espacios del campus y los filtra localmente por categoría.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {string} category - Categoría a mostrar o ALL para todas
 * @returns {{ spaces: Array, loading: boolean, error: string|null, refresh: Function }}
 *          Espacios filtrados, estado de carga, error y función de recarga
 */
const useSpaces = (category) => {
  const { data, loading, error, refresh } = useCachedResource('spaces', fetchAllSpaces);

  const spaces = useMemo(
    () => data.filter((space) => category === ALL_VALUE || space.categoria === category),
    [data, category],
  );

  return { spaces, loading, error, refresh };
};

/**
 * @description Hook de búsqueda de espacios en el backend con debounce de 300 ms. No consulta
 *              mientras el texto tenga menos de 2 caracteres.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {string} query - Texto que escribe el usuario
 * @returns {{ results: Array, loading: boolean, error: string|null, tooShort: boolean }}
 *          Resultados, estado de carga, error e indicador de texto demasiado corto
 */
export const useSpaceSearch = (query) => {
  const debounced = useDebouncedValue(query.trim(), 300);
  const [state, setState] = useState({ results: [], loading: false, error: null });

  useEffect(() => {
    if (debounced.length < MIN_SEARCH_LENGTH) {
      setState({ results: [], loading: false, error: null });
      return undefined;
    }
    let active = true;
    setState((previous) => ({ ...previous, loading: true, error: null }));
    searchSpaces(debounced)
      .then((results) => active && setState({ results, loading: false, error: null }))
      .catch((error) => active && setState({ results: [], loading: false, error: getErrorMessage(error) }));
    return () => {
      active = false;
    };
  }, [debounced]);

  return { ...state, tooShort: query.trim().length < MIN_SEARCH_LENGTH };
};

export default useSpaces;
