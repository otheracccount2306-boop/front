import { useCallback, useEffect, useState } from 'react';
import useCacheStore from '../store/cache.store';
import { getErrorMessage } from '../utils/error.utils';

const useCachedResource = (cacheName, fetcher) => {
  const cached = useCacheStore((state) => state[cacheName]);
  const setCacheData = useCacheStore((state) => state.setCacheData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetcher();
      setCacheData(cacheName, data);
      setError(null);
    } catch (fetchError) {
      setError(getErrorMessage(fetchError));
    } finally {
      setLoading(false);
    }
  }, [cacheName, fetcher, setCacheData]);

  useEffect(() => {
    load();
  }, [load]);

  return { data: cached, loading: loading && cached.length === 0, error, refresh: load };
};

export default useCachedResource;
