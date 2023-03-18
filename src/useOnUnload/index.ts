import { useEffect, useRef } from 'react';

export type UnloadCallback = ((ev: BeforeUnloadEvent) => void) | (() => void);

export const useOnUnload = (callback: UnloadCallback): void => {
  const actionsRef = useRef(callback);
  useEffect(() => {
    actionsRef.current = callback;
  }, [callback]);

  useEffect(() => {
    window.addEventListener('beforeunload', actionsRef.current);
    window.addEventListener('unload', actionsRef.current);
    return () => {
      window.removeEventListener('beforeunload', actionsRef.current);
      window.removeEventListener('unload', actionsRef.current);
    };
  }, []);
};
