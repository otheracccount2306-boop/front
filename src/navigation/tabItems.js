export const TAB_ITEMS = [
  { name: 'InicioTab', root: 'Dashboard', label: 'Inicio', icon: 'home-outline' },
  { name: 'AcademicoTab', root: 'Schedule', label: 'Académico', icon: 'school-outline' },
  { name: 'ServiciosTab', root: 'Wellbeing', label: 'Servicios', icon: 'heart-outline' },
  { name: 'CampusTab', root: 'CampusMap', label: 'Campus', icon: 'map-outline' },
  { name: 'NoticiasTab', root: 'News', label: 'Noticias', icon: 'newspaper-outline' },
];

export { SIDEBAR_WIDTH } from '../theme/layout';

export const PROFILE_ITEM = { name: 'InicioTab', root: 'Profile', label: 'Mi perfil', icon: 'person-circle-outline' };

export { SIDEBAR_MIN_WIDTH } from '../theme/layout';

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
