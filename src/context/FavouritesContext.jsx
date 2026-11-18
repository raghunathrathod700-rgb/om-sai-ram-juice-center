import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { loadFavourites, saveFavourites } from '../services/userService';

const FavouritesContext = createContext(null);

export const FavouritesProvider = ({ children }) => {
  const [ids, setIds] = useState(() => {
    const saved = loadFavourites();
    return Array.isArray(saved) ? saved : [];
  });

  const toggleFavourite = useCallback((id) => {
    setIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      saveFavourites(next);
      return next;
    });
  }, []);

  const isFavourite = useCallback((id) => ids.includes(id), [ids]);

  const value = useMemo(
    () => ({ favouriteIds: ids, favouriteCount: ids.length, toggleFavourite, isFavourite }),
    [ids, toggleFavourite, isFavourite]
  );

  return <FavouritesContext.Provider value={value}>{children}</FavouritesContext.Provider>;
};

export const useFavourites = () => {
  const ctx = useContext(FavouritesContext);
  if (!ctx) throw new Error('useFavourites must be used inside <FavouritesProvider>');
  return ctx;
};
