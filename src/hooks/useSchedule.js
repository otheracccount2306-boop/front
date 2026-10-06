import { useMemo } from 'react';
import { getSchedule } from '../api/academic.api';
import useCachedResource from './useCachedResource';
import { formatTime } from '../utils/date.utils';

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
