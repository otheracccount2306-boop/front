import { useCallback, useEffect, useRef, useState } from 'react';

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
