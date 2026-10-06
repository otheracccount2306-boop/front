import { useMemo } from 'react';
import { getFaq } from '../api/services.api';
import useCachedResource from './useCachedResource';
import { ALL_VALUE } from '../utils/category.utils';
import { matchesTerm } from '../utils/text.utils';

const fetchAllFaq = () => getFaq();

const useFaq = (category, search) => {
  const { data, loading, error, refresh } = useCachedResource('faq', fetchAllFaq);

  const faq = useMemo(
    () =>
      data.filter(
        (item) =>
          (category === ALL_VALUE || item.categoria === category) &&
          matchesTerm(item, ['pregunta', 'respuesta'], search),
      ),
    [data, category, search],
  );

  return { faq, all: data, loading, error, refresh };
};

export default useFaq;
