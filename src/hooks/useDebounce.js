import { useEffect, useState } from 'react';

/** Returns `value` only after it stopped changing for `delay` ms (search boxes etc.). */
export const useDebounce = (value, delay = 300) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
};
