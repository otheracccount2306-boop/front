/**
 * @description Ítems del menú del panel administrativo, en el orden en que se muestran. Cada uno
 *              indica la pestaña, su etiqueta, su ícono y la pantalla raíz a la que vuelve al elegirlo.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 */
export const ADMIN_MENU = [
  { name: 'AdminDashboardTab', label: 'Dashboard', icon: 'speedometer-outline', root: 'AdminDashboard' },
  { name: 'AdminNewsTab', label: 'Noticias', icon: 'newspaper-outline', root: 'NewsManagement' },
  { name: 'AdminEventsTab', label: 'Eventos', icon: 'calendar-outline', root: 'EventsManagement' },
  { name: 'AdminServicesTab', label: 'Servicios', icon: 'heart-outline', root: 'ServicesManagement' },
  { name: 'AdminSpacesTab', label: 'Espacios', icon: 'map-outline', root: 'SpacesManagement' },
  { name: 'AdminAcademicTab', label: 'Académico', icon: 'school-outline', root: 'SubjectsManagement' },
  { name: 'AdminUsersTab', label: 'Usuarios', icon: 'people-outline', root: 'UsersManagement' },
];
