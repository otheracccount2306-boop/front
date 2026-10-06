import { useEffect, useState } from 'react';

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
