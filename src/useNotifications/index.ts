import { useCallback, useState } from 'react';
import { useMountedRef } from '../useMountedRef';

export type NotificationId = string;
export type UseNotification<T> = {
  id: NotificationId;
  visible: boolean;
  timeout?: number;
  _timer?: ReturnType<typeof setTimeout>;
  data: T;
};
export interface UseNotificationsResponse<T> {
  notifications: Dict<UseNotification<T>>;
  add: (id: NotificationId, data: T, timeout?: number) => void;
  remove: (id: NotificationId) => void;
  delete: (id: NotificationId) => void;
}

const clearTimer = (n?: UseNotification<unknown>) => {
  if (!n) return;
  if (n._timer) clearTimeout(n._timer);
};

export const useNotifications = <T = unknown>(
  shouldDelete?: boolean,
): UseNotificationsResponse<T> => {
  const mountedRef = useMountedRef();
  const [notifications, setNotifications] = useState<Dict<UseNotification<T>>>(
    {},
  );

  const remove = useCallback((id: NotificationId): void => {
    setNotifications((prev) => {
      clearTimer(prev[id]);
      return {
        ...prev,
        [id]: {
          ...prev[id],
          visible: false,
        },
      };
    });
  }, []);

  const del = useCallback((id: NotificationId): void => {
    setNotifications((prev) => {
      clearTimer(prev[id]);
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
  }, []);

  const add = useCallback(
    (id: NotificationId, data: T, timeout = 3500): void => {
      const _timer = timeout
        ? setTimeout(() => {
            if (mountedRef.current) shouldDelete ? del(id) : remove(id);
          }, timeout)
        : undefined;
      setNotifications((prev) =>
        prev[id] && prev[id].visible
          ? prev
          : {
              ...prev,
              [id]: {
                id,
                visible: true,
                timeout,
                _timer,
                data,
              },
            },
      );
    },
    [del, mountedRef, remove, shouldDelete],
  );

  return { notifications, add, remove, delete: del };
};
