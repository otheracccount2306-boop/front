import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * @description Hook que evita perder cambios sin guardar en un formulario: intercepta la salida de
 *              la pantalla y, si hay cambios, pide confirmación antes de continuar.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Object} navigation - Objeto de navegación de la pantalla
 * @param {boolean} dirty - Indica si el formulario tiene cambios sin guardar
 * @returns {{ visible: boolean, confirmExit: Function, cancelExit: Function, allowExit: Function }}
 *          Estado del diálogo y funciones para confirmarlo, cancelarlo o permitir la salida
 */
const useUnsavedGuard = (navigation, dirty) => {
  const [pending, setPending] = useState(null);
  const allowed = useRef(false);

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (event) => {
        if (!dirty || allowed.current) {
          return;
        }
        event.preventDefault();
        setPending(event.data.action);
      }),
    [navigation, dirty],
  );

  const confirmExit = useCallback(() => {
    allowed.current = true;
    const action = pending;
    setPending(null);
    navigation.dispatch(action);
  }, [navigation, pending]);

  const cancelExit = useCallback(() => setPending(null), []);
  const allowExit = useCallback(() => {
    allowed.current = true;
  }, []);

  return { visible: Boolean(pending), confirmExit, cancelExit, allowExit };
};

export default useUnsavedGuard;
