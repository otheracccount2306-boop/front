import { useCallback, useEffect, useRef, useState } from 'react';
import { getErrorMessage } from '../utils/error.utils';

/**
 * @description Hook genérico que carga una lista desde la API al montar y cada vez que cambian
 *              las dependencias. Descarta respuestas de solicitudes que ya fueron reemplazadas.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Function} fetcher - Función asíncrona que devuelve la lista
 * @param {Array} deps - Dependencias que disparan una nueva carga
 * @returns {{ data: Array, loading: boolean, error: string|null, refresh: Function }} Estado de la carga
 */
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
