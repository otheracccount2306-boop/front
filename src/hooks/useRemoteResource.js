import { useCallback, useEffect, useRef, useState } from 'react';
import { getErrorMessage } from '../utils/error.utils';

const useRemoteResource = (fetcher, deps = []) => {
  const [state, setState] = useState({ data: [], loading: true, error: null });
  const requestId = useRef(0);

  const load = useCallback(async () => {
    requestId.current += 1;
    const id = requestId.current;
    setState((previous) => ({ ...previous, loading: true, error: null }));
    try {
      const data = await fetcher();
      if (id === requestId.current) {
        setState({ data, loading: false, error: null });
      }
    } catch (error) {
      if (id === requestId.current) {
        setState((previous) => ({ ...previous, loading: false, error: getErrorMessage(error) }));
      }
    }
  }, deps);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, refresh: load };
};

export default useRemoteResource;
