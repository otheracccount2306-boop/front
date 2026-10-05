import apiClient from './client';

/**
 * @description Obtiene una página de noticias publicadas, 10 por página.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Object} [options] - Opciones de consulta
 * @param {string} [options.category] - Categoría de la noticia
 * @param {number} [options.page] - Número de página, iniciando en 1
 * @returns {Promise<{ content: Array, page: number, totalPages: number, totalElements: number }>} Página de noticias
 */
export const getNews = async ({ category, page = 1 } = {}) => {
  const params = { page };
  if (category) {
    params.category = category;
  }
  return (await apiClient.get('/news', { params })).data.data;
};

/**
 * @description Obtiene el detalle completo de una noticia.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {string} id - Identificador de la noticia
 * @returns {Promise<Object>} Noticia con su contenido completo
 */
export const getNewsById = async (id) => (await apiClient.get(`/news/${id}`)).data.data;

/**
 * @description Obtiene una página de eventos activos con fecha de hoy o futura, 10 por página.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Object} [options] - Opciones de consulta
 * @param {string} [options.category] - Categoría del evento
 * @param {string} [options.from] - Fecha mínima en formato YYYY-MM-DD
 * @param {string} [options.to] - Fecha máxima en formato YYYY-MM-DD
 * @param {number} [options.page] - Número de página, iniciando en 1
 * @returns {Promise<{ content: Array, page: number, totalPages: number, totalElements: number }>} Página de eventos
 */
export const getEvents = async ({ category, from, to, page = 1 } = {}) => {
  const params = { page };
  if (category) {
    params.category = category;
  }
  if (from) {
    params.from = from;
  }
  if (to) {
    params.to = to;
  }
  return (await apiClient.get('/events', { params })).data.data;
};
