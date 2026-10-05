import apiClient from './client';

/**
 * @description Obtiene el horario del estudiante autenticado, opcionalmente filtrado por día.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {string} [day] - Día de la semana en mayúsculas y sin tildes, por ejemplo LUNES
 * @returns {Promise<Array>} Asignaturas del horario
 */
export const getSchedule = async (day) =>
  (await apiClient.get('/academic/schedule', { params: day ? { day } : undefined })).data.data;

/**
 * @description Obtiene el calendario académico institucional, opcionalmente filtrado por categoría.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {string} [category] - Categoría del evento, por ejemplo EXAMENES
 * @returns {Promise<Array>} Eventos del calendario
 */
export const getCalendar = async (category) =>
  (await apiClient.get('/academic/calendar', { params: category ? { category } : undefined })).data.data;
