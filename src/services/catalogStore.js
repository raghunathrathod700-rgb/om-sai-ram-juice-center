/**
 * CATALOGUE STORE — the single live copy of products + categories.
 *   local demo mode : filled instantly from src/data/products.js
 *   API mode        : loaded from GET /api/products and /api/categories
 * React reads it through useProducts() (useSyncExternalStore), the cart reads it synchronously.
 */
import { USE_API } from '../config/shop';
import { categories as localCategories, products as localProducts } from '../data/products';
import { getProductPhoto } from '../utils/productPhotos';
import { absoluteUrl, http } from './http';

const mapProduct = (p) => ({
  id: p.id,
  name: p.name,
  category: p.category,
  price: Number(p.price),
  description: p.description || '',
  imageType: p.imageType,
  color: p.color,
  brand: p.brand || undefined,
  rating: p.rating == null ? undefined : p.rating,
  available: !!p.available,
  featured: !!p.featured,
  // photo uploaded in the admin panel wins, then a photo bundled with the site, else the drawing
  photo: p.imageUrl ? absoluteUrl(p.imageUrl) : getProductPhoto(p.name),
});

let state = USE_API
  ? { products: [], categories: [], loading: true, error: null }
  : { products: localProducts, categories: localCategories, loading: false, error: null };

const listeners = new Set();
const emit = (patch) => {
  state = { ...state, ...patch };
  listeners.forEach((listener) => listener());
};

export const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
export const getSnapshot = () => state;

let inFlight = null;

/** Loads the catalogue (API mode). Safe to call many times; pass force=true to reload after an admin change. */
export const loadCatalog = (force = false) => {
  if (!USE_API) return Promise.resolve(state);
  if (inFlight && !force) return inFlight;
  if (!state.products.length) emit({ loading: true });
  inFlight = Promise.all([http.get('/api/products'), http.get('/api/categories')])
    .then(([products, categories]) => {
      emit({ products: products.map(mapProduct), categories, loading: false, error: null });
      return state;
    })
    .catch((error) => {
      inFlight = null; // allow a retry
      emit({ loading: false, error });
      return state;
    });
  return inFlight;
};
