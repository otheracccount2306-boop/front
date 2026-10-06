import { getEvents } from '../api/news.api';
import usePaginated from './usePaginated';
import { ALL_VALUE } from '../utils/category.utils';

const useEvents = ({ category, from, to }) =>
  usePaginated(
    (page) => getEvents({ category: category === ALL_VALUE ? undefined : category, from, to, page }),
    [category, from, to],
  );

export default useEvents;
