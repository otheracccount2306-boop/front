/**
 * @description Secciones principales de la aplicación: nombre de la pestaña, pantalla inicial de su
 *              pila, etiqueta e ícono. Las usan el menú de hamburguesa del celular y el menú lateral
 *              de la versión web.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 */
export const TAB_ITEMS = [
  { name: 'InicioTab', root: 'Dashboard', label: 'Inicio', icon: 'home-outline' },
  { name: 'AcademicoTab', root: 'Schedule', label: 'Académico', icon: 'school-outline' },
  { name: 'ServiciosTab', root: 'Wellbeing', label: 'Servicios', icon: 'heart-outline' },
  { name: 'CampusTab', root: 'CampusMap', label: 'Campus', icon: 'map-outline' },
  { name: 'NoticiasTab', root: 'News', label: 'Noticias', icon: 'newspaper-outline' },
];

export { SIDEBAR_WIDTH } from '../theme/layout';

/**
 * @description Opción del menú que abre el perfil del estudiante (pila de Inicio).
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 */
export const PROFILE_ITEM = { name: 'InicioTab', root: 'Profile', label: 'Mi perfil', icon: 'person-circle-outline' };

/**
 * @description Ancho mínimo de ventana, en puntos, a partir del cual la versión web usa el menú
 *              lateral fijo; por debajo se usa el menú de hamburguesa, igual que en el celular.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 */
export { SIDEBAR_MIN_WIDTH } from '../theme/layout';

/**
 * @description Indica qué opción del menú resaltar según el estado del navegador de pestañas: el
 *              perfil cuando está abierto dentro de Inicio y, en otro caso, la pestaña activa.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {Object|null|undefined} tabState - Estado del navegador de pestañas
 * @returns {string|null} 'Profile', el nombre de la pestaña activa o null si no hay estado
 */
export const activeMenuKey = (tabState) => {
  if (!tabState || !Array.isArray(tabState.routes)) {
    return null;
  }
  const tab = tabState.routes[tabState.index || 0];
  if (!tab) {
    return null;
  }
  const nested = tab.state && Array.isArray(tab.state.routes) ? tab.state.routes[tab.state.index || 0] : null;
  return tab.name === PROFILE_ITEM.name && nested && nested.name === PROFILE_ITEM.root ? 'Profile' : tab.name;
};
