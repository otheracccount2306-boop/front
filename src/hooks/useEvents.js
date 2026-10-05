import { getEvents } from '../api/news.api';
import usePaginated from './usePaginated';
import { ALL_VALUE } from '../utils/category.utils';

/**
 * @description Hook de eventos futuros con paginación infinita. Se reinicia al cambiar la
 *              categoría o el rango de fechas. El backend ya excluye los eventos pasados.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Object} filters - Filtros de la consulta
 * @param {string} filters.category - Categoría a mostrar o ALL para todas
 * @param {string} [filters.from] - Fecha mínima en formato YYYY-MM-DD
 * @param {string} [filters.to] - Fecha máxima en formato YYYY-MM-DD
 * @returns {{ items: Array, loading: boolean, refreshing: boolean, loadingMore: boolean, error: string|null, hasMore: boolean, loadMore: Function, refresh: Function }}
 *          Estado de la lista paginada de eventos
 */
const useEvents = ({ category, from, to }) =>
  usePaginated(
    (page) => getEvents({ category: category === ALL_VALUE ? undefined : category, from, to, page }),
    [category, from, to],
  );

export default useEvents;
