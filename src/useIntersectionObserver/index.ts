import { MutableRefObject, useEffect, useRef, useState } from 'react';

export interface UseIntersectionObserverResponse<TElement> {
  ref: MutableRefObject<TElement | null>;
  isIntersecting: boolean;
}
const supported =
  'IntersectionObserver' in window && 'IntersectionObserverEntry' in window;
const defaultOpts = { rootMargin: '150px 0px' };

export const useIntersectionObserver = <TElement extends HTMLElement>(
  options: IntersectionObserverInit = defaultOpts,
  forward = true,
): UseIntersectionObserverResponse<TElement> => {
  const ref = useRef<TElement>(null);
  const optRef = useRef<IntersectionObserverInit>(options);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observer = useRef<null | IntersectionObserver>(null);

  const cleanOb = () => {
    if (observer.current) observer.current.disconnect();
  };

  useEffect(() => {
    if (!ref.current) return;
    if (!supported) {
      setIsIntersecting(true);
      return;
    }
    cleanOb();
    const ob = (observer.current = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting;
        setIsIntersecting((prev) => {
          if (forward && !prev && isElementIntersecting) cleanOb();
          return isElementIntersecting;
        });
      },
      { ...optRef.current },
    ));
    ob.observe(ref.current);
    return () => {
      cleanOb();
    };
  }, [forward]);

  return { ref, isIntersecting };
};
