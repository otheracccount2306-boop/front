import { useCallback, useState } from 'react';
import { getAdminErrorMessage } from '../utils/admin.utils';

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
