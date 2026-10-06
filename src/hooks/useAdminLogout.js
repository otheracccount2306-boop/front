import { useCallback, useState } from 'react';
import useAuth from './useAuth';

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
