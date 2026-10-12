/**
 * @description Pestañas principales de la aplicación: nombre de ruta, etiqueta e ícono. Las usan
 *              tanto la barra inferior como el menú lateral de la versión web.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 */
export const TAB_ITEMS = [
  { name: 'InicioTab', label: 'Inicio', icon: 'home-outline' },
  { name: 'AcademicoTab', label: 'Académico', icon: 'school-outline' },
  { name: 'ServiciosTab', label: 'Servicios', icon: 'heart-outline' },
  { name: 'CampusTab', label: 'Campus', icon: 'map-outline' },
  { name: 'NoticiasTab', label: 'Noticias', icon: 'newspaper-outline' },
];

export { SIDEBAR_WIDTH } from '../theme/layout';

/**
 * @description Ancho mínimo de ventana, en puntos, a partir del cual la versión web usa el menú
 *              lateral; por debajo se usa la barra inferior, igual que en el celular.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 */
export { SIDEBAR_MIN_WIDTH } from '../theme/layout';
