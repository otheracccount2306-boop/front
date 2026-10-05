import { useMemo } from 'react';
import { getCalendar } from '../api/academic.api';
import useCachedResource from './useCachedResource';
import { ALL_VALUE } from '../utils/category.utils';

/**
 * @description Hook que obtiene y cachea el calendario académico institucional y lo filtra por
 *              categoría en el dispositivo. Devuelve los eventos en orden cronológico.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {string} category - Categoría a mostrar o ALL para todas
 * @returns {{ events: Array, loading: boolean, error: string|null, refresh: Function }}
 *          Eventos filtrados, estado de carga, error y función de recarga
 */
const useCalendar = (category) => {
  const { data, loading, error, refresh } = useCachedResource('calendar', getCalendar);

  const events = useMemo(
    () =>
      data
        .filter((event) => category === ALL_VALUE || event.categoria === category)
        .sort((a, b) => a.fechaInicio.localeCompare(b.fechaInicio)),
    [data, category],
  );

  return { events, loading, error, refresh };
};

export default useCalendar;
