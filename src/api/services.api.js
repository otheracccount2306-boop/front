import apiClient from './client';

/**
 * @description Obtiene los servicios de bienestar, opcionalmente filtrados por categoría.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {string} [category] - PSICOLOGIA, SALUD, DEPORTE, CULTURA, PASTORAL o BECAS
 * @returns {Promise<Array>} Servicios de bienestar
 */
export const getWellbeing = async (category) =>
  (await apiClient.get('/services/wellbeing', { params: category ? { category } : undefined })).data.data;

/**
 * @description Obtiene las dependencias del directorio institucional, opcionalmente filtradas por nombre.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {string} [search] - Texto contenido en el nombre
 * @returns {Promise<Array>} Dependencias del directorio
 */
export const getDepartments = async (search) =>
  (await apiClient.get('/services/departments', { params: search ? { search } : undefined })).data.data;

/**
 * @description Obtiene las preguntas frecuentes, opcionalmente filtradas por categoría y palabra clave.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Object} [filters] - Filtros opcionales
 * @param {string} [filters.category] - Categoría de la pregunta
 * @param {string} [filters.search] - Palabra clave
 * @returns {Promise<Array>} Preguntas frecuentes
 */
export const getFaq = async (filters = {}) => {
  const params = {};
  if (filters.category) {
    params.category = filters.category;
  }
  if (filters.search) {
    params.search = filters.search;
  }
  return (await apiClient.get('/services/faq', { params })).data.data;
};
