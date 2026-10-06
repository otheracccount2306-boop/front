import { useEffect, useMemo, useState } from 'react';
import { getSpaces, searchSpaces } from '../api/campus.api';
import useCachedResource from './useCachedResource';
import { ALL_VALUE } from '../utils/category.utils';
import { useDebouncedValue } from '../utils/debounce.utils';
import { getErrorMessage } from '../utils/error.utils';

const MIN_SEARCH_LENGTH = 2;
const fetchAllSpaces = () => getSpaces();

const useSpaces = (category) => {
  const { data, loading, error, refresh } = useCachedResource('spaces', fetchAllSpaces);

  const spaces = useMemo(
    () => data.filter((space) => category === ALL_VALUE || space.categoria === category),
    [data, category],
  );

  return { spaces, loading, error, refresh };
};

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
