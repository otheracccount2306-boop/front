/**
 * @description Abre el mapa del campus (la pantalla principal del módulo Campus) con un espacio
 *              iluminado desde cualquier pestaña, por ejemplo el aula de una clase del horario.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {Object} navigation - Objeto de navegación de React Navigation
 * @param {string} spaceId - UUID del espacio a mostrar
 * @returns {void}
 */
export const openSpaceOnMap = (navigation, spaceId) => {
  if (!navigation || !spaceId) {
    return;
  }
  navigation.navigate('CampusTab', { screen: 'CampusMap', params: { spaceId } });
};

export default openSpaceOnMap;
