import apiClient from './client';

/**
 * @description Obtiene los espacios del campus, opcionalmente filtrados por categoría.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {string} [category] - AULA, LABORATORIO, OFICINA, BIBLIOTECA, CAFETERIA o AREA_COMUN
 * @returns {Promise<Array>} Espacios del campus
 */
export const getSpaces = async (category) =>
  (await apiClient.get('/campus/spaces', { params: category ? { category } : undefined })).data.data;

/**
 * @description Busca espacios del campus por nombre o código.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {string} query - Texto buscado, de al menos 2 caracteres
 * @returns {Promise<Array>} Espacios que coinciden con la búsqueda
 */
export const searchSpaces = async (query) =>
  (await apiClient.get('/campus/spaces/search', { params: { q: query } })).data.data;
