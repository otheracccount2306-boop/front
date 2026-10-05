import { useCallback, useEffect, useRef, useState } from 'react';
import { getErrorMessage } from '../utils/error.utils';

/**
 * @description Hook genérico de paginación con scroll infinito. Reinicia la lista cuando cambian
 *              las dependencias y evita solicitudes de páginas duplicadas.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Function} fetchPage - Recibe el número de página y devuelve { content, page, totalPages }
 * @param {Array} deps - Dependencias que reinician la lista, por ejemplo los filtros
 * @returns {{ items: Array, loading: boolean, refreshing: boolean, loadingMore: boolean, error: string|null, hasMore: boolean, loadMore: Function, refresh: Function }} Estado de la lista paginada
 */
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
