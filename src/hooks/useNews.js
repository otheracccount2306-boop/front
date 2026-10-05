import { getNews } from '../api/news.api';
import usePaginated from './usePaginated';
import { ALL_VALUE } from '../utils/category.utils';

/**
 * @description Hook de noticias con paginación infinita de 10 en 10. Se reinicia al cambiar la categoría.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {string} category - Categoría a mostrar o ALL para todas
 * @returns {{ items: Array, loading: boolean, refreshing: boolean, loadingMore: boolean, error: string|null, hasMore: boolean, loadMore: Function, refresh: Function }}
 *          Estado de la lista paginada de noticias
 */
const useNews = (category) =>
  usePaginated((page) => getNews({ category: category === ALL_VALUE ? undefined : category, page }), [category]);

export default useNews;
