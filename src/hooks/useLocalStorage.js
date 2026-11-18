import { useCallback, useState } from 'react';

/** useState that is mirrored to localStorage (safe against blocked / corrupt storage). */
export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const set = useCallback(
    (next) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? next(prev) : next;
        try {
          localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          /* storage full / blocked — keep working in memory */
        }
        return resolved;
      });
    },
    [key]
  );

  return [value, set];
};
