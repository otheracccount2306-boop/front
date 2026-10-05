import { useCallback, useState } from 'react';
import { getAdminErrorMessage } from '../utils/admin.utils';

/**
 * @description Hook que ejecuta acciones de administración (activar, archivar, eliminar...) y
 *              conserva el estado de la última: en curso, mensaje de éxito o mensaje de error ya
 *              traducido a español. run recibe la acción, el mensaje de éxito y, opcionalmente, mensajes
 *              por código HTTP o una función que traduce el error a un mensaje propio.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @returns {{ busy: boolean, message: string|null, error: string|null, run: Function, clear: Function }}
 *          Estado de la acción y funciones para ejecutarla y limpiar los mensajes
 */
const useAdminActions = () => {
  const [state, setState] = useState({ busy: false, message: null, error: null });

  const run = useCallback(async (action, successMessage, overrides) => {
    setState({ busy: true, message: null, error: null });
    try {
      await action();
      setState({ busy: false, message: successMessage, error: null });
      return true;
    } catch (error) {
      const custom = typeof overrides === 'function' ? overrides(error) : null;
      const byStatus = typeof overrides === 'object' ? overrides : undefined;
      setState({ busy: false, message: null, error: custom || getAdminErrorMessage(error, byStatus) });
      return false;
    }
  }, []);

  const clear = useCallback(() => setState({ busy: false, message: null, error: null }), []);

  return { ...state, run, clear };
};

export default useAdminActions;
