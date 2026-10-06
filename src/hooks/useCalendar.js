import { useMemo } from 'react';
import { getCalendar } from '../api/academic.api';
import useCachedResource from './useCachedResource';
import { ALL_VALUE } from '../utils/category.utils';

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
