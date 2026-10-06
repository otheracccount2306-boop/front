/**
 * @description Abre el mapa del campus con un espacio iluminado desde cualquier pestaña (por
 *              ejemplo, el aula de una clase del horario). El mapa queda encima de la lista de
 *              espacios del módulo Campus, así "atrás" vuelve a esa lista y no a una pantalla vacía.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {Object} navigation - Objeto de navegación de React Navigation
 * @param {string} spaceId - UUID del espacio a mostrar
 * @returns {void}
 */
export const openSpaceOnMap = (navigation, spaceId) => {
  if (!navigation || !spaceId) {
    return;
  }
  navigation.navigate("CampusTab", {
    screen: "CampusMap",
    initial: false,
    params: { spaceId },
  });
};

export default openSpaceOnMap;
