import { useEffect, useState } from 'react';

export const useLoadScript = (url: string, props?: Dict<string>): boolean => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const existing =
      document.querySelectorAll(`script[src="${url}"]`).length > 0;
    if (existing) {
      setLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = url;
    if (props) {
      Object.keys(props).forEach((key) => {
        script.setAttribute(key, props[key]);
      });
    }
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);
  }, [props, url]);

  return loaded;
};
