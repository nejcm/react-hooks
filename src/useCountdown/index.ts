import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface UseCountdownProps {
  /** Date to countdown to */
  date: number | Date;
  /** Countdown interval */
  interval?: number;
  /** Autostart countdown */
  autostart?: boolean;
  /** On end callback */
  onEnd?: () => void;
  /** On tick callback */
  onTick?: () => void;
}
export interface Actions {
  /** Start countdown */
  start: (ttc?: number) => void;
  /** Pause countdown */
  pause: () => void;
  /** Resume countdown */
  resume: () => void;
  /** Reset countdown */
  reset: () => void;
  /** Restart countdown */
  restart: (time?: number) => void;
}
export type UseCountdownResponse = [
  /** Time left */
  number,
  /** End time */
  number,
  /** Actions */
  Actions,
];

const parseDate = (date: number | Date): number => {
  if (typeof date === 'number') return date;
  return +new Date(date) - +new Date();
};

export const useCountdown = ({
  date,
  interval = 1000,
  autostart = true,
  onEnd,
  onTick,
}: UseCountdownProps): UseCountdownResponse => {
  const dateRef = useRef<number | Date>(date);
  const timeRef = useRef<number>(parseDate(date));
  const [timeLeft, setTimeLeft] = useState(timeRef.current);
  const callbacksRef = useRef({ onTick, onEnd });
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>();

  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  }, []);

  const run = useCallback(() => {
    setTimeLeft((left) => {
      const newTime = Math.max(left - interval, 0);
      if (newTime <= 0) {
        stopInterval();
        if (callbacksRef.current.onEnd) {
          callbacksRef.current.onEnd();
        }
      }
      return newTime;
    });
    if (callbacksRef.current.onTick) {
      callbacksRef.current.onTick();
    }
  }, [interval, stopInterval]);

  const start = useCallback(
    (ttc?: number | Date) => {
      const newTime = parseDate(ttc ?? timeRef.current);
      setTimeLeft(newTime);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (newTime > 0) intervalRef.current = setInterval(run, interval);
      else {
        if (callbacksRef.current.onEnd) {
          callbacksRef.current.onEnd();
        }
      }
    },
    [interval, run],
  );

  const pause = useCallback(() => stopInterval(), [stopInterval]);
  const resume = useCallback(() => start(), [start]);
  const restart = useCallback((time?: number) => {
    timeRef.current = time || timeRef.current;
    setTimeLeft(timeRef.current);
  }, []);
  const reset = useCallback(() => {
    stopInterval();
    setTimeLeft(0);
  }, [stopInterval]);

  useEffect(() => {
    if (autostart) start();
  }, [autostart, start]);

  useEffect(() => {
    dateRef.current = date;
    const time = parseDate(date);
    if (timeRef.current !== time) restart(time);
  }, [date, restart]);

  useEffect(() => {
    callbacksRef.current = {
      onEnd,
      onTick,
    };
  }, [onEnd, onTick]);

  useEffect(() => {
    return () => stopInterval();
  }, [stopInterval]);

  const actions = useMemo(
    () => ({ start, pause, resume, reset, restart }),
    [pause, reset, resume, start, restart],
  );
  return [timeLeft, timeRef.current, actions];
};
