import { useEffect, useRef } from 'react';

export const useMountedRef = (): React.RefObject<boolean> => {
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);
  return mountedRef;
};
