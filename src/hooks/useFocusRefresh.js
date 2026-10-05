import { useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';

/**
 * @description Hook que vuelve a cargar un listado cada vez que la pantalla recupera el foco (por
 *              ejemplo al volver de un formulario), sin duplicar la carga inicial.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Function} refresh - Función de recarga del listado
 * @returns {void}
 */
const useFocusRefresh = (refresh) => {
  const first = useRef(true);

  useFocusEffect(
    useCallback(() => {
      if (first.current) {
        first.current = false;
        return;
      }
      refresh();
    }, [refresh]),
  );
};

export default useFocusRefresh;
