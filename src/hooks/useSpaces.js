import { useMemo } from 'react';
import { getSpaces } from '../api/campus.api';
import useCachedResource from './useCachedResource';
import { ALL_VALUE } from '../utils/category.utils';

const fetchAllSpaces = () => getSpaces();

const useSpaces = (category) => {
  const { data, loading, error, refresh } = useCachedResource('spaces', fetchAllSpaces);

  const spaces = useMemo(
    () => data.filter((space) => category === ALL_VALUE || space.categoria === category),
    [data, category],
  );

  return { spaces, loading, error, refresh };
};

export default useSpaces;
