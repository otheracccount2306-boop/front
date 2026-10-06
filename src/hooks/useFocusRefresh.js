import { useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';

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
