import { useCallback, useEffect, useState } from 'react';
import useCacheStore from '../store/cache.store';
import { getErrorMessage } from '../utils/error.utils';

/**
 * @description Hook genérico con caché local. Devuelve de inmediato los datos guardados en el
 *              store (rehidratados desde AsyncStorage) y los actualiza en segundo plano con la
 *              respuesta de la API.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {'schedule'|'spaces'|'faq'|'calendar'|'plans'} cacheName - Nombre de la caché en el store
 * @param {Function} fetcher - Función asíncrona estable que devuelve la lista completa
 * @returns {{ data: Array, loading: boolean, error: string|null, refresh: Function }} Datos en caché y estado de la actualización
 */
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
