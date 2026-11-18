/** ADMIN API (needs a logged-in ADMIN). Catalogue changes refresh the shared catalogue store automatically. */
import { loadCatalog } from './catalogStore';
import { http } from './http';
import { mapServerOrder } from './orderApi';

/* ---- orders / dashboard ---- */
export const getStats = () => http.get('/api/admin/stats');

export const listOrders = async (status) => {
  const query = status ? `?status=${encodeURIComponent(status)}` : '';
  return (await http.get(`/api/admin/orders${query}`)).map(mapServerOrder);
};

export const setOrderStatus = async (id, status) =>
  mapServerOrder(await http.put(`/api/admin/orders/${encodeURIComponent(id)}/status`, { status }));

export const setPaymentStatus = async (id, status) =>
  mapServerOrder(await http.put(`/api/admin/orders/${encodeURIComponent(id)}/payment`, { status }));

/* ---- products ---- */
export const createProduct = async (data) => {
  const created = await http.post('/api/admin/products', data);
  await loadCatalog(true);
  return created;
};

export const updateProduct = async (id, data) => {
  const updated = await http.put(`/api/admin/products/${id}`, data);
  await loadCatalog(true);
  return updated;
};

export const deleteProduct = async (id) => {
  await http.del(`/api/admin/products/${id}`);
  await loadCatalog(true);
};

export const uploadProductImage = async (id, file) => {
  const form = new FormData();
  form.append('file', file);
  const updated = await http.upload(`/api/admin/products/${id}/image`, form);
  await loadCatalog(true);
  return updated;
};

export const removeProductImage = async (id) => {
  const updated = await http.del(`/api/admin/products/${id}/image`);
  await loadCatalog(true);
  return updated;
};

/* ---- categories ---- */
export const createCategory = async (name, icon) => {
  const created = await http.post('/api/admin/categories', { name, icon });
  await loadCatalog(true);
  return created;
};

export const deleteCategory = async (id) => {
  await http.del(`/api/admin/categories/${encodeURIComponent(id)}`);
  await loadCatalog(true);
};

/** The full product payload the API expects (used for quick edits such as "change price only"). */
export const toProductRequest = (p, overrides = {}) => ({
  name: p.name,
  category: p.category,
  price: p.price,
  description: p.description || '',
  imageType: p.imageType,
  color: p.color,
  brand: p.brand || '',
  rating: p.rating == null ? null : p.rating,
  available: p.available,
  featured: !!p.featured,
  ...overrides,
});
