import apiClient from "./client";

const SERVICE_PATHS = {
  wellbeing: "wellbeing",
  department: "departments",
  departments: "departments",
  faq: "faq",
};

/**
 * @description Elimina de los parámetros los valores vacíos para no enviarlos al backend.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Object} params - Parámetros de consulta
 * @returns {Object} Parámetros sin valores indefinidos, nulos o vacíos
 */
const pickParams = (params) =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    ),
  );

/**
 * @description Traduce el tipo de servicio del panel (wellbeing, department o faq) al segmento
 *              de ruta que espera el backend (wellbeing, departments o faq).
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {string} type - Tipo de servicio del panel
 * @returns {string} Segmento de ruta del backend
 */
const servicePath = (type) => SERVICE_PATHS[type] || type;

/**
 * @description Lista usuarios de forma paginada. Solo para administradores.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @param {Object} [options] - Opciones de consulta
 * @param {string} [options.search] - Texto de búsqueda por nombre, correo o programa
 * @param {boolean} [options.active] - true para solo cuentas activas, false para solo inactivas
 * @param {number} [options.page] - Número de página, iniciando en 1
 * @returns {Promise<Object>} Página de usuarios
 */
export const listUsers = async ({ search, active, page = 1 } = {}) =>
  (
    await apiClient.get("/admin/users", {
      params: pickParams({ page, search, active }),
    })
  ).data.data;

/**
 * @description Activa o desactiva la cuenta de un usuario.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @param {string} id - Identificador del usuario
 * @param {boolean} activo - true para activar, false para desactivar
 * @returns {Promise<Object>} Usuario actualizado
 */
export const updateUserStatus = async (id, activo) =>
  (await apiClient.put(`/admin/users/${id}/status`, { activo })).data.data;

/**
 * @description Cambia el rol de un usuario entre ESTUDIANTE y ADMINISTRADOR.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @param {string} id - Identificador del usuario
 * @param {string} rol - Nuevo rol
 * @returns {Promise<Object>} Usuario actualizado
 */
export const updateUserRole = async (id, rol) =>
  (await apiClient.put(`/admin/users/${id}/role`, { rol })).data.data;

/**
 * @description Elimina definitivamente a un usuario (derecho de supresión, Ley 1581 de 2012).
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @param {string} id - Identificador del usuario
 * @returns {Promise<void>} Promesa resuelta al eliminar el usuario
 */
export const deleteUser = async (id) => {
  await apiClient.delete(`/admin/users/${id}`);
};

/**
 * @description Lista los roles disponibles en el sistema.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @returns {Promise<Array>} Roles con su descripción
 */
export const listRoles = async () =>
  (await apiClient.get("/admin/roles")).data.data;

/**
 * @description Lista noticias de cualquier estado, incluidos borradores y archivadas.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Object} [options] - Opciones de consulta
 * @param {string} [options.category] - Categoría de la noticia
 * @param {string} [options.status] - BORRADOR, PUBLICADO o ARCHIVADO
 * @param {number} [options.page] - Número de página, iniciando en 1
 * @returns {Promise<Object>} Página de noticias completas
 */
export const listAllNews = async ({ category, status, page = 1 } = {}) =>
  (
    await apiClient.get("/admin/news", {
      params: pickParams({ category, status, page }),
    })
  ).data.data;

/**
 * @description Crea una noticia como borrador o publicada.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Object} data - Datos de la noticia (titulo, resumen, contenido, categoria, imagenUrl, estado)
 * @returns {Promise<Object>} Noticia creada
 */
export const createNews = async (data) =>
  (await apiClient.post("/admin/news", data)).data.data;

/**
 * @description Actualiza una noticia. Una noticia publicada no puede volver a borrador.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {string} id - Identificador de la noticia
 * @param {Object} data - Datos de la noticia
 * @returns {Promise<Object>} Noticia actualizada
 */
export const updateNews = async (id, data) =>
  (await apiClient.put(`/admin/news/${id}`, data)).data.data;

/**
 * @description Archiva lógicamente una noticia (estado ARCHIVADO).
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {string} id - Identificador de la noticia
 * @returns {Promise<void>} Promesa resuelta al archivar la noticia
 */
export const deleteNews = async (id) => {
  await apiClient.delete(`/admin/news/${id}`);
};

/**
 * @description Lista eventos de cualquier estado y fecha, incluidos concluidos y cancelados.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Object} [options] - Opciones de consulta
 * @param {string} [options.category] - Categoría del evento
 * @param {string} [options.status] - ACTIVO, CONCLUIDO o CANCELADO
 * @param {number} [options.page] - Número de página, iniciando en 1
 * @returns {Promise<Object>} Página de eventos
 */
export const listAllEvents = async ({ category, status, page = 1 } = {}) =>
  (
    await apiClient.get("/admin/events", {
      params: pickParams({ category, status, page }),
    })
  ).data.data;

/**
 * @description Crea un evento institucional.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Object} data - Datos del evento (nombre, descripcion, categoria, lugar, fechaHora, cupos)
 * @returns {Promise<Object>} Evento creado
 */
export const createEvent = async (data) =>
  (await apiClient.post("/admin/events", data)).data.data;

/**
 * @description Actualiza un evento institucional.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {string} id - Identificador del evento
 * @param {Object} data - Datos del evento, incluido el estado ACTIVO o CANCELADO
 * @returns {Promise<Object>} Evento actualizado
 */
export const updateEvent = async (id, data) =>
  (await apiClient.put(`/admin/events/${id}`, data)).data.data;

/**
 * @description Cancela lógicamente un evento activo (estado CANCELADO).
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {string} id - Identificador del evento
 * @returns {Promise<void>} Promesa resuelta al cancelar el evento
 */
export const deleteEvent = async (id) => {
  await apiClient.delete(`/admin/events/${id}`);
};

/**
 * @description Lista servicios de bienestar, dependencias o preguntas frecuentes, incluidos los inactivos.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {'wellbeing'|'department'|'faq'} type - Tipo de recurso
 * @param {Object} [options] - Opciones de consulta
 * @param {string} [options.category] - Categoría a filtrar
 * @returns {Promise<Array>} Recursos de cualquier estado
 */
export const listAllServices = async (type, { category } = {}) =>
  (
    await apiClient.get(`/admin/services/${servicePath(type)}`, {
      params: pickParams({ category }),
    })
  ).data.data;

/**
 * @description Crea un servicio de bienestar, una dependencia o una pregunta frecuente.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {'wellbeing'|'department'|'faq'} type - Tipo de recurso
 * @param {Object} data - Datos del recurso
 * @returns {Promise<Object>} Recurso creado
 */
export const createService = async (type, data) =>
  (await apiClient.post(`/admin/services/${servicePath(type)}`, data)).data
    .data;

/**
 * @description Actualiza un servicio, dependencia o pregunta frecuente, incluido su estado activo.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {'wellbeing'|'department'|'faq'} type - Tipo de recurso
 * @param {string} id - Identificador del recurso
 * @param {Object} data - Datos del recurso
 * @returns {Promise<Object>} Recurso actualizado
 */
export const updateService = async (type, id, data) =>
  (await apiClient.put(`/admin/services/${servicePath(type)}/${id}`, data)).data
    .data;

/**
 * @description Elimina lógicamente un servicio, dependencia o pregunta frecuente.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {'wellbeing'|'department'|'faq'} type - Tipo de recurso
 * @param {string} id - Identificador del recurso
 * @returns {Promise<void>} Promesa resuelta al eliminar el recurso
 */
export const deleteService = async (type, id) => {
  await apiClient.delete(`/admin/services/${servicePath(type)}/${id}`);
};

/**
 * @description Lista todos los espacios del campus, activos e inactivos.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {Object} [options] - Opciones de consulta
 * @param {string} [options.category] - Categoría del espacio
 * @returns {Promise<Array>} Espacios de cualquier estado
 */
export const listAllSpaces = async ({ category } = {}) =>
  (
    await apiClient.get("/admin/campus/spaces", {
      params: pickParams({ category }),
    })
  ).data.data;

/**
 * @description Crea un espacio del campus.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {Object} data - Datos del espacio
 * @returns {Promise<Object>} Espacio creado
 */
export const createSpace = async (data) =>
  (await apiClient.post("/admin/campus/spaces", data)).data.data;

/**
 * @description Actualiza un espacio del campus, incluido su estado activo.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {string} id - Identificador del espacio
 * @param {Object} data - Datos del espacio
 * @returns {Promise<Object>} Espacio actualizado
 */
export const updateSpace = async (id, data) =>
  (await apiClient.put(`/admin/campus/spaces/${id}`, data)).data.data;

/**
 * @description Elimina lógicamente un espacio del campus.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {string} id - Identificador del espacio
 * @returns {Promise<void>} Promesa resuelta al eliminar el espacio
 */
export const deleteSpace = async (id) => {
  await apiClient.delete(`/admin/campus/spaces/${id}`);
};

/**
 * @description Lista los planos del campus, activos e inactivos, sin la imagen.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @returns {Promise<Array>} Planos con la cantidad de espacios dibujados
 */
export const listAllPlans = async () =>
  (await apiClient.get("/admin/campus/plans")).data.data;

/**
 * @description Obtiene un plano de cualquier estado con su imagen y todos sus polígonos.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {string} id - Identificador del plano
 * @returns {Promise<Object>} Plano completo para el editor
 */
export const getAdminPlan = async (id) =>
  (await apiClient.get(`/admin/campus/plans/${id}`)).data.data;

/**
 * @description Crea un plano. La imagen viaja como data URL y el servidor lee sus dimensiones.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {Object} data - nombre, edificio, piso, imagen, ancho, alto y activo
 * @returns {Promise<Object>} Plano creado
 */
export const createPlan = async (data) =>
  (await apiClient.post("/admin/campus/plans", data, { timeout: 60000 })).data
    .data;

/**
 * @description Actualiza un plano; imagen null conserva la actual.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {string} id - Identificador del plano
 * @param {Object} data - Datos del plano
 * @returns {Promise<Object>} Plano actualizado
 */
export const updatePlan = async (id, data) =>
  (await apiClient.put(`/admin/campus/plans/${id}`, data, { timeout: 60000 }))
    .data.data;

/**
 * @description Elimina un plano de forma definitiva, con su imagen. Los espacios dibujados sobre él
 *              siguen en el catálogo pero quedan sin ubicar. El backend exige el nombre del plano
 *              como confirmación (400 si no coincide).
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {string} id - Identificador del plano
 * @param {string} confirmacion - Nombre del plano escrito por el administrador
 * @returns {Promise<string>} Mensaje del servidor con los espacios que quedaron sin ubicar
 */
export const deletePlan = async (id, confirmacion) =>
  (
    await apiClient.delete(`/admin/campus/plans/${id}/permanent`, {
      params: { confirmacion },
    })
  ).data.message;

/**
 * @description Guarda el polígono GeoJSON de un espacio dibujado sobre un plano.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {string} spaceId - Identificador del espacio
 * @param {string} planoId - Plano sobre el que se dibujó
 * @param {Object} geometria - GeoJSON Geometry de tipo Polygon en píxeles del plano
 * @returns {Promise<Object>} Espacio actualizado
 */
export const saveSpaceGeometry = async (spaceId, planoId, geometria) =>
  (
    await apiClient.put(`/admin/campus/spaces/${spaceId}/geometry`, {
      planoId,
      geometria,
    })
  ).data.data;

/**
 * @description Quita el polígono de un espacio.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {string} spaceId - Identificador del espacio
 * @returns {Promise<Object>} Espacio sin ubicación en el mapa
 */
export const clearSpaceGeometry = async (spaceId) =>
  (await apiClient.delete(`/admin/campus/spaces/${spaceId}/geometry`)).data
    .data;

/**
 * @description Lista las asignaturas, activas e inactivas, opcionalmente de un periodo académico.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {Object} [options] - Opciones de consulta
 * @param {string} [options.period] - Periodo académico, por ejemplo 2026-1
 * @returns {Promise<Array>} Asignaturas
 */
export const listSubjects = async ({ period } = {}) =>
  (
    await apiClient.get("/admin/academic/subjects", {
      params: pickParams({ period }),
    })
  ).data.data;

/**
 * @description Crea una asignatura.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {Object} data - Datos de la asignatura; dias es un arreglo de días en mayúsculas
 * @returns {Promise<Object>} Asignatura creada
 */
export const createSubject = async (data) =>
  (await apiClient.post("/admin/academic/subjects", data)).data.data;

/**
 * @description Actualiza una asignatura, incluido su estado activo.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {string} id - Identificador de la asignatura
 * @param {Object} data - Datos de la asignatura
 * @returns {Promise<Object>} Asignatura actualizada
 */
export const updateSubject = async (id, data) =>
  (await apiClient.put(`/admin/academic/subjects/${id}`, data)).data.data;

/**
 * @description Elimina lógicamente una asignatura.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {string} id - Identificador de la asignatura
 * @returns {Promise<void>} Promesa resuelta al eliminar la asignatura
 */
export const deleteSubject = async (id) => {
  await apiClient.delete(`/admin/academic/subjects/${id}`);
};

/**
 * @description Lista los eventos del calendario académico institucional.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {Object} [options] - Opciones de consulta
 * @param {string} [options.category] - Categoría del evento
 * @returns {Promise<Array>} Eventos del calendario
 */
export const listCalendarEvents = async ({ category } = {}) =>
  (
    await apiClient.get("/academic/calendar", {
      params: pickParams({ category }),
    })
  ).data.data;

/**
 * @description Crea un evento del calendario académico.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {Object} data - Datos del evento (nombre, descripcion, categoria, fechaInicio, fechaFin)
 * @returns {Promise<Object>} Evento creado
 */
export const createCalendarEvent = async (data) =>
  (await apiClient.post("/admin/academic/calendar", data)).data.data;

/**
 * @description Actualiza un evento del calendario académico.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {string} id - Identificador del evento
 * @param {Object} data - Datos del evento
 * @returns {Promise<Object>} Evento actualizado
 */
export const updateCalendarEvent = async (id, data) =>
  (await apiClient.put(`/admin/academic/calendar/${id}`, data)).data.data;

/**
 * @description Elimina lógicamente un evento del calendario académico.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {string} id - Identificador del evento
 * @returns {Promise<void>} Promesa resuelta al eliminar el evento
 */
export const deleteCalendarEvent = async (id) => {
  await apiClient.delete(`/admin/academic/calendar/${id}`);
};
