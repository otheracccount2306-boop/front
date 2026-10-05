import { useMemo } from 'react';
import { getSchedule } from '../api/academic.api';
import useCachedResource from './useCachedResource';
import { formatTime } from '../utils/date.utils';

/**
 * @description Hook que obtiene y cachea el horario académico del estudiante. Muestra primero el
 *              caché local y actualiza en segundo plano. Devuelve las clases del día pedido
 *              ordenadas por hora de inicio.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {string} day - Día de la semana en mayúsculas y sin tildes (LUNES, MARTES, ...)
 * @returns {{ schedule: Array, all: Array, loading: boolean, error: string|null, refresh: Function }}
 *          Clases del día, horario completo, estado de carga, error y función de recarga
 */
const useSchedule = (day) => {
  const { data, loading, error, refresh } = useCachedResource('schedule', getSchedule);

  const schedule = useMemo(
    () =>
      data
        .filter((subject) => subject.dias.includes(day))
        .sort((a, b) => formatTime(a.horaInicio).localeCompare(formatTime(b.horaInicio))),
    [data, day],
  );

  return { schedule, all: data, loading, error, refresh };
};

export default useSchedule;
