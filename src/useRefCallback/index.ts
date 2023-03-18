import { useEffect, useRef } from 'react';

// eslint-disable-next-line @typescript-eslint/ban-types
export type CallbackOrAction = Function | object;

export const useRefCallback = <T extends CallbackOrAction>(
  /** callback or action */
  callback: T,
): React.MutableRefObject<T> => {
  const ref = useRef(callback);
  useEffect(() => {
    ref.current = callback;
  }, [callback]);
  return ref;
};
