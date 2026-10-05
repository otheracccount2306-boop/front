import { useMemo } from 'react';
import { getWellbeing } from '../api/services.api';
import useRemoteResource from './useRemoteResource';
import { ALL_VALUE } from '../utils/category.utils';

/**
 * @description Consulta todos los servicios de bienestar sin filtros; el filtrado por categoría
 *              se hace en el dispositivo. Es una referencia estable para el hook de carga.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @returns {Promise<Array>} Servicios de bienestar
 */
const fetchAllWellbeing = () => getWellbeing();

/**
 * @description Hook que obtiene los servicios de bienestar activos y los filtra por categoría
 *              en el dispositivo.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {string} category - Categoría a mostrar o ALL para todas
 * @returns {{ services: Array, loading: boolean, error: string|null, refresh: Function }}
 *          Servicios filtrados, estado de carga, error y función de recarga
 */
const useServices = (category) => {
  const { data, loading, error, refresh } = useRemoteResource(fetchAllWellbeing, []);

  const services = useMemo(
    () => data.filter((service) => category === ALL_VALUE || service.categoria === category),
    [data, category],
  );

  return { services, loading, error, refresh };
};

export default useServices;
