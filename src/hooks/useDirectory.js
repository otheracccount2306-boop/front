import { useMemo } from 'react';
import { getDepartments } from '../api/services.api';
import useRemoteResource from './useRemoteResource';
import { matchesTerm } from '../utils/text.utils';

/**
 * @description Consulta todo el directorio sin filtros; el filtrado se hace en el dispositivo.
 *              Es una referencia estable para el hook de carga.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @returns {Promise<Array>} Dependencias del directorio
 */
const fetchAllDepartments = () => getDepartments();

/**
 * @description Hook que obtiene el directorio institucional completo una sola vez y lo filtra
 *              localmente por nombre, sin tildes ni mayúsculas, sin llamar al backend por
 *              cada carácter escrito.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {string} search - Texto de búsqueda ya con debounce
 * @returns {{ departments: Array, loading: boolean, error: string|null, refresh: Function }}
 *          Dependencias filtradas, estado de carga, error y función de recarga
 */
const useDirectory = (search) => {
  const { data, loading, error, refresh } = useRemoteResource(fetchAllDepartments, []);

  const departments = useMemo(
    () => data.filter((department) => matchesTerm(department, ['nombre', 'descripcion'], search)),
    [data, search],
  );

  return { departments, loading, error, refresh };
};

export default useDirectory;
