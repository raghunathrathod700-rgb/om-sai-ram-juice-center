import { useEffect, useSyncExternalStore } from 'react';
import { getSnapshot, loadCatalog, subscribe } from '../services/catalogStore';

/** { products, categories, loading, error } — re-renders whenever the catalogue changes (e.g. admin edits a price). */
export const useProducts = () => {
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  useEffect(() => {
    loadCatalog();
  }, []);
  return state;
};
