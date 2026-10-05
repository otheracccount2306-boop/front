import { useEffect, useState } from 'react';

/**
 * @description Hook que recoge el mensaje de confirmación enviado por un formulario al volver al
 *              listado (parámetro de ruta flash) y lo conserva en estado local. Limpia el parámetro
 *              para que el mensaje no reaparezca al volver a entrar a la pantalla.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Object} route - Ruta actual de React Navigation
 * @param {Object} navigation - Objeto de navegación
 * @param {Function} [onArrive] - Se ejecuta cuando llega un mensaje nuevo, por ejemplo para borrar el de la última acción
 * @returns {[string|null, Function]} Mensaje vigente y función para reemplazarlo o borrarlo
 */
const useFlash = (route, navigation, onArrive) => {
  const [flash, setFlash] = useState(null);
  const incoming = route.params ? route.params.flash : undefined;

  useEffect(() => {
    if (incoming) {
      setFlash(incoming);
      if (onArrive) {
        onArrive();
      }
      navigation.setParams({ flash: undefined });
    }
  }, [incoming, navigation, onArrive]);

  return [flash, setFlash];
};

export default useFlash;
