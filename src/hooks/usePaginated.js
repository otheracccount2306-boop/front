import { useCallback, useEffect, useRef, useState } from 'react';
import { getErrorMessage } from '../utils/error.utils';

const usePaginated = (fetchPage, deps = []) => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const requestId = useRef(0);
  const busy = useRef(false);

  const loadPage = useCallback(async (target, replace) => {
    if (replace) {
      requestId.current += 1;
    }
    const id = requestId.current;
    busy.current = true;
    setError(null);
    if (replace) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    try {
      const result = await fetchPage(target);
      if (id !== requestId.current) {
        return;
      }
      setItems((previous) => (replace ? result.content : [...previous, ...result.content]));
      setPage(result.page);
      setTotalPages(result.totalPages);
    } catch (fetchError) {
      if (id === requestId.current) {
        setError(getErrorMessage(fetchError));
      }
    } finally {
      if (id === requestId.current) {
        busy.current = false;
        setLoading(false);
        setLoadingMore(false);
      }
    }
  }, deps);

  useEffect(() => {
    setItems([]);
    setPage(0);
    setTotalPages(1);
    loadPage(1, true);
  }, [loadPage]);

  const loadMore = useCallback(() => {
    if (busy.current || page === 0 || page >= totalPages) {
      return;
    }
    loadPage(page + 1, false);
  }, [loadPage, page, totalPages]);

  const refresh = useCallback(() => loadPage(1, true), [loadPage]);

  return {
    items,
    loading: loading && items.length === 0,
    refreshing: loading && items.length > 0,
    loadingMore,
    error,
    hasMore: page > 0 && page < totalPages,
    loadMore,
    refresh,
  };
};

export default usePaginated;
