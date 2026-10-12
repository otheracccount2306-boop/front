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

/**
 * @description Registra una clase en el horario del estudiante autenticado. El dueño lo pone el
 *              servidor a partir de la sesión; no se envía.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {Object} data - { nombre, docente, aula, dias, horaInicio, horaFin }
 * @returns {Promise<Object>} Clase creada, como aparece en el horario (origen PERSONAL)
 */
export const createPersonalClass = async (data) => (await apiClient.post('/academic/personal-classes', data)).data.data;

/**
 * @description Modifica una clase que registró el estudiante autenticado.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {string} id - Identificador de la clase
 * @param {Object} data - { nombre, docente, aula, dias, horaInicio, horaFin }
 * @returns {Promise<Object>} Clase actualizada
 */
export const updatePersonalClass = async (id, data) =>
  (await apiClient.put(`/academic/personal-classes/${id}`, data)).data.data;

/**
 * @description Borra una clase que registró el estudiante autenticado.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {string} id - Identificador de la clase
 * @returns {Promise<void>} Promesa resuelta al borrar
 */
export const deletePersonalClass = async (id) => {
  await apiClient.delete(`/academic/personal-classes/${id}`);
};
