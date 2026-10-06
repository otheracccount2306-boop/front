import { getNews } from '../api/news.api';
import usePaginated from './usePaginated';
import { ALL_VALUE } from '../utils/category.utils';

const useNews = (category) =>
  usePaginated((page) => getNews({ category: category === ALL_VALUE ? undefined : category, page }), [category]);

export default useNews;
