/**
 * PRODUCT SERVICE — read helpers over the catalogue store (see catalogStore.js).
 * Admin changes go through adminService.js, which refreshes the store afterwards.
 */
import { getSnapshot, loadCatalog } from './catalogStore';

export { loadCatalog };

export const getProductSync = (id) => getSnapshot().products.find((p) => String(p.id) === String(id));

export const findProductByName = (name) => {
  const wanted = name.trim().toLowerCase();
  return getSnapshot().products.find((p) => p.name.toLowerCase() === wanted);
};

export const searchProductsSync = (query, limit = 6) => {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return getSnapshot()
    .products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        p.category.replace('-', ' ').includes(q) ||
        (p.description || '').toLowerCase().includes(q)
    )
    .slice(0, limit);
};

export const getRelatedProducts = (product, limit = 4) =>
  product ? getSnapshot().products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, limit) : [];

export const getCategoryName = (id) => getSnapshot().categories.find((c) => c.id === id)?.name || id;
