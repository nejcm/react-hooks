import { useCallback, useMemo, useState } from 'react';

export type UseBooleanActions = {
  setValue: (val: boolean) => void;
  toggle: () => void;
  setTrue: () => void;
  setFalse: () => void;
};
export type UseBooleanResponse = [boolean, UseBooleanActions];

export const useBoolean = (initial = false): UseBooleanResponse => {
  const [value, setValue] = useState<boolean>(initial);
  const toggle = useCallback(() => setValue((v) => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  const actions = useMemo(
    () => ({ setValue, toggle, setTrue, setFalse }),
    [setFalse, setTrue, toggle],
  );
  return useMemo(() => [value, actions], [actions, value]);
};
