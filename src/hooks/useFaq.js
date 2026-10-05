import { useMemo } from 'react';
import { getFaq } from '../api/services.api';
import useCachedResource from './useCachedResource';
import { ALL_VALUE } from '../utils/category.utils';
import { matchesTerm } from '../utils/text.utils';

/**
 * @description Consulta todas las preguntas frecuentes sin filtros; el filtrado se hace en el
 *              dispositivo. Es una referencia estable para el hook con caché.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @returns {Promise<Array>} Preguntas frecuentes
 */
const fetchAllFaq = () => getFaq();

/**
 * @description Hook que obtiene y cachea las preguntas frecuentes y las filtra localmente por
 *              categoría y palabra clave, sin tildes ni mayúsculas.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {string} category - Categoría a mostrar o ALL para todas
 * @param {string} search - Palabra clave ya con debounce
 * @returns {{ faq: Array, all: Array, loading: boolean, error: string|null, refresh: Function }}
 *          Preguntas filtradas, lista completa, estado de carga, error y función de recarga
 */
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
