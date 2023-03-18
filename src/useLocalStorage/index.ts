import { useCallback, useMemo, useState } from 'react';
import { storageService } from './storage';
import { Storage } from './types';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const debounce = <T extends any[]>(
  func: (...args: T) => any,
  timeout = 300,
) => {
  let timer: NodeJS.Timeout | undefined;
  return (...args: T) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };
};

export type State<T> =
  | {
      data?: T;
      cacheTime?: number;
    }
  | undefined;

export interface UseLocalStorageProps<T> {
  /** Storage key */
  key: string;
  /** Default/fallback value */
  defaultValue?: T;
  /** Should the value updating be debounced (eg.: for quickly changing values) */
  debounce?: number;
  /** Cache time in seconds (undefined = infinity) */
  cacheTime?: number;
}
export interface UseLocalStorageResponse<T> {
  /** Storage state/value */
  state: T | undefined;
  /** Set storage value */
  set: (data: T | undefined) => void;
  /** Merge storage value with existing (eg.: updating part of an object) */
  merge: (data: Partial<T> | ((data?: T) => T) | undefined) => void;
  /** Clear storage value */
  clear: () => void;
}

const hasExpired = (cacheTime?: number): boolean =>
  !!cacheTime && cacheTime < new Date().getTime();

export const useLocalStorage = <T>({
  key,
  defaultValue,
  debounce: debounceTime,
  cacheTime,
}: UseLocalStorageProps<T>): UseLocalStorageResponse<T> => {
  type Def = UseLocalStorageResponse<T>;
  const [state, setState] = useState<T | undefined>(() => {
    const { data, cacheTime: ct } =
      storageService.getParsed<State<T>>(key) || {};
    return (hasExpired(ct) ? undefined : data) ?? defaultValue;
  });

  const storageSet = useMemo<Storage['set']>(() => {
    const fn: Storage['set'] = (key, v) => {
      const vct: State<T> = {
        data: v as any,
        cacheTime: cacheTime
          ? new Date().getTime() + cacheTime * 1000
          : undefined,
      };
      storageService.set(key, vct);
    };
    return debounceTime ? debounce(fn, debounceTime) : fn;
  }, [cacheTime, debounceTime]);

  const set = useCallback<Def['set']>(
    (value) => {
      setState(value);
      storageSet(key, value);
    },
    [key, storageSet],
  );
  const clear = useCallback<Def['clear']>(() => {
    storageService.remove(key);
    setState(undefined);
  }, [key]);
  const merge = useCallback<Def['merge']>(
    (value) => {
      setState((prev) => {
        const newVal =
          typeof value === 'function'
            ? value(prev)
            : ({ ...prev, ...value } as T);
        storageSet(key, newVal);
        return newVal;
      });
    },
    [key, storageSet],
  );
  return { state, set, merge, clear };
};

export { storageService };
