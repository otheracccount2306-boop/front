import { useCallback, useState } from 'react';
import useAuth from './useAuth';

/**
 * @description Hook del cierre de sesión del administrador con diálogo de confirmación. Lo usan el
 *              menú lateral, el menú móvil y el encabezado del dashboard.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @returns {{ visible: boolean, loading: boolean, open: Function, close: Function, confirm: Function }}
 *          Estado del diálogo y funciones para abrirlo, cerrarlo y confirmar el cierre de sesión
 */
const useAdminLogout = () => {
  const { logout } = useAuth();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const open = useCallback(() => setVisible(true), []);
  const close = useCallback(() => setVisible(false), []);
  const confirm = useCallback(async () => {
    setLoading(true);
    await logout();
  }, [logout]);

  return { visible, loading, open, close, confirm };
};

export default useAdminLogout;
