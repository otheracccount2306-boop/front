import { useMemo } from 'react';
import { getSpaces } from '../api/campus.api';
import useCachedResource from './useCachedResource';
import { ALL_VALUE } from '../utils/category.utils';

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

export default useSpaces;
