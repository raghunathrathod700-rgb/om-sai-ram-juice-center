import { useEffect, useMemo, useState } from 'react';
import { Modal } from 'react-bootstrap';
import EmptyState from '../EmptyState';
import LoadingSpinner from '../LoadingSpinner';
import ProductThumb from '../ProductThumb';
import { useToast } from '../../context/ToastContext';
import { useProducts } from '../../hooks/useProducts';
import {
  createProduct,
  deleteProduct,
  removeProductImage,
  toProductRequest,
  updateProduct,
  uploadProductImage,
} from '../../services/adminService';
import { formatCurrency } from '../../utils/helpers';

const IMAGE_TYPES = [
  { id: 'juice', label: 'Juice glass' },
  { id: 'lassi', label: 'Lassi glass' },
  { id: 'shake', label: 'Milkshake glass' },
  { id: 'faluda', label: 'Faluda glass' },
  { id: 'icecream', label: 'Ice cream scoop' },
  { id: 'combo', label: 'Combo' },
];
const MAX_PHOTO = 5 * 1024 * 1024;

/* ---------------------------- add / edit window ---------------------------- */
const ProductForm = ({ product, categories, onClose }) => {
  const { showToast } = useToast();
  const editing = !!product;
  const [form, setForm] = useState(() => ({
    name: product?.name || '',
    category: product?.category || categories[0]?.id || '',
    price: product ? String(product.price) : '',
    description: product?.description || '',
    brand: product?.brand || '',
    imageType: product?.imageType || 'juice',
    color: (product?.color || '#FF9800').toUpperCase(),
    rating: product?.rating == null ? '' : String(product.rating),
    available: product ? product.available : true,
    featured: product ? !!product.featured : false,
  }));
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!file) {
      setPreview('');
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const pickFile = (e) => {
    const chosen = e.target.files?.[0];
    if (!chosen) return;
    if (!/^image\/(jpeg|png|webp)$/.test(chosen.type)) return setError('Please choose a JPG, PNG or WebP photo.');
    if (chosen.size > MAX_PHOTO) return setError('The photo is too large (maximum 5 MB).');
    setError('');
    setFile(chosen);
    return undefined;
  };

  const submit = async (e) => {
    e.preventDefault();
    const price = Number(form.price);
    if (!form.name.trim()) return setError('Enter the item name.');
    if (!form.category) return setError('Choose a category.');
    if (!(price > 0)) return setError('Enter a price greater than 0.');
    if (form.rating !== '' && !(Number(form.rating) >= 0 && Number(form.rating) <= 5)) return setError('Rating must be between 0 and 5.');
    if (!/^#[0-9a-fA-F]{6}$/.test(form.color)) return setError('Colour must look like #FF9800.');

    const data = {
      name: form.name.trim(),
      category: form.category,
      price,
      description: form.description.trim(),
      imageType: form.imageType,
      color: form.color,
      brand: form.brand.trim(),
      rating: form.rating === '' ? null : Number(form.rating),
      available: form.available,
      featured: form.featured,
    };
    setSaving(true);
    setError('');
    try {
      const saved = editing ? await updateProduct(product.id, data) : await createProduct(data);
      if (file) await uploadProductImage(saved.id, file);
      showToast(editing ? 'Item updated.' : 'New item added.', 'success');
      onClose();
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
    return undefined;
  };

  const removePhoto = async () => {
    try {
      await removeProductImage(product.id);
      showToast('Uploaded photo removed.', 'success');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Modal show onHide={saving ? undefined : onClose} size="lg" centered backdrop="static" scrollable>
      <Modal.Header closeButton={!saving}>
        <Modal.Title className="h5">{editing ? `Edit: ${product.name}` : 'Add a new item'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <div className="alert alert-danger py-2 small" role="alert">
            {error}
          </div>
        )}
        <form id="product-form" onSubmit={submit} noValidate>
          <div className="row g-3">
            <div className="col-md-8">
              <label htmlFor="pf-name" className="form-label">Item name</label>
              <input id="pf-name" className="form-control" value={form.name} onChange={set('name')} maxLength={120} />
            </div>
            <div className="col-md-4">
              <label htmlFor="pf-price" className="form-label">Price (₹)</label>
              <input id="pf-price" type="number" min="0" step="any" inputMode="decimal" className="form-control" value={form.price} onChange={set('price')} />
            </div>
            <div className="col-md-6">
              <label htmlFor="pf-cat" className="form-label">Category</label>
              <select id="pf-cat" className="form-select" value={form.category} onChange={set('category')}>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="pf-brand" className="form-label">Brand (ice creams only)</label>
              <input id="pf-brand" className="form-control" value={form.brand} onChange={set('brand')} maxLength={60} placeholder="e.g. Amul" />
            </div>
            <div className="col-12">
              <label htmlFor="pf-desc" className="form-label">Short description</label>
              <textarea id="pf-desc" rows={2} className="form-control" value={form.description} onChange={set('description')} maxLength={600} />
            </div>

            <div className="col-12">
              <label htmlFor="pf-photo" className="form-label">Photo</label>
              <div className="d-flex flex-wrap gap-3 align-items-center">
                <div className="osrjc-admin-preview">
                  {preview ? (
                    <img src={preview} alt="New photo preview" />
                  ) : editing ? (
                    <ProductThumb product={product} />
                  ) : (
                    <i className="bi bi-image" aria-hidden="true"></i>
                  )}
                </div>
                <div className="flex-grow-1">
                  <input id="pf-photo" type="file" accept="image/jpeg,image/png,image/webp" className="form-control" onChange={pickFile} />
                  <div className="form-text">JPG / PNG / WebP, up to 5 MB. Without a photo, a drawing in the style below is shown.</div>
                  {editing && (
                    <button type="button" className="btn btn-link btn-sm text-danger px-0" onClick={removePhoto}>
                      Remove the photo I uploaded earlier
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <label htmlFor="pf-style" className="form-label">Drawing style (no photo)</label>
              <select id="pf-style" className="form-select" value={form.imageType} onChange={set('imageType')}>
                {IMAGE_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label htmlFor="pf-color" className="form-label">Drawing colour</label>
              <div className="d-flex gap-2">
                <input aria-label="Pick colour" type="color" className="form-control form-control-color" value={form.color} onChange={set('color')} />
                <input id="pf-color" className="form-control" value={form.color} onChange={set('color')} maxLength={7} />
              </div>
            </div>
            <div className="col-md-4">
              <label htmlFor="pf-rating" className="form-label">Rating (optional)</label>
              <input id="pf-rating" type="number" min="0" max="5" step="0.1" className="form-control" value={form.rating} onChange={set('rating')} />
              <div className="form-text">Leave empty unless it is a genuine rating.</div>
            </div>

            <div className="col-12 d-flex flex-wrap gap-4">
              <div className="form-check form-switch">
                <input id="pf-avail" type="checkbox" role="switch" className="form-check-input" checked={form.available} onChange={set('available')} />
                <label htmlFor="pf-avail" className="form-check-label">Available (untick = &quot;Sold Out&quot;)</label>
              </div>
              <div className="form-check form-switch">
                <input id="pf-feat" type="checkbox" role="switch" className="form-check-input" checked={form.featured} onChange={set('featured')} />
                <label htmlFor="pf-feat" className="form-check-label">Show in &quot;Popular Products&quot; on the home page</label>
              </div>
            </div>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <button type="button" className="btn btn-outline-secondary" onClick={onClose} disabled={saving}>Cancel</button>
        <button type="submit" form="product-form" className="btn btn-osrjc-primary" disabled={saving}>
          {saving ? 'Saving...' : editing ? 'Save changes' : 'Add item'}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

/* ---------------------------- product list ---------------------------- */
const AdminProducts = () => {
  const { products, categories, loading } = useProducts();
  const { showToast } = useToast();
  const [query, setQuery] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [editing, setEditing] = useState(null); // null | 'new' | product
  const [drafts, setDrafts] = useState({}); // id -> price text being typed
  const [busyId, setBusyId] = useState(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) => (catFilter === 'all' || p.category === catFilter) && (!q || p.name.toLowerCase().includes(q) || (p.brand || '').toLowerCase().includes(q))
    );
  }, [products, query, catFilter]);

  const run = async (id, task, okMessage) => {
    setBusyId(id);
    try {
      await task();
      if (okMessage) showToast(okMessage, 'success');
    } catch (err) {
      showToast(err.message, 'danger');
    } finally {
      setBusyId(null);
    }
  };

  const savePrice = (p) => {
    const price = Number(drafts[p.id]);
    if (!(price > 0)) return showToast('Enter a price greater than 0.', 'danger');
    return run(p.id, async () => {
      await updateProduct(p.id, toProductRequest(p, { price }));
      setDrafts((d) => {
        const next = { ...d };
        delete next[p.id];
        return next;
      });
    }, `${p.name} is now ${formatCurrency(price)}`);
  };

  const toggle = (p, field) => run(p.id, () => updateProduct(p.id, toProductRequest(p, { [field]: !p[field] })));

  const remove = (p) => {
    if (!window.confirm(`Delete "${p.name}" from the menu? Old orders keep their record.`)) return undefined;
    return run(p.id, () => deleteProduct(p.id), `${p.name} deleted.`);
  };

  if (loading) return <LoadingSpinner text="Loading menu..." />;

  return (
    <>
      <div className="d-flex flex-wrap gap-2 align-items-end mb-3">
        <div className="flex-grow-1" style={{ maxWidth: 320 }}>
          <label htmlFor="ap-search" className="form-label small mb-1">Search</label>
          <input id="ap-search" type="search" className="form-control" placeholder="Name or brand" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div>
          <label htmlFor="ap-cat" className="form-label small mb-1">Category</label>
          <select id="ap-cat" className="form-select" value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <button type="button" className="btn btn-osrjc-primary ms-auto" onClick={() => setEditing('new')}>
          <i className="bi bi-plus-lg me-1" aria-hidden="true"></i>Add new item
        </button>
      </div>

      {visible.length === 0 ? (
        <EmptyState title="No items found" text="Try a different search, or add a new item." />
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table align-middle osrjc-admin-table mb-0">
              <thead>
                <tr>
                  <th scope="col">Item</th>
                  <th scope="col">Price (₹)</th>
                  <th scope="col" className="text-center">Available</th>
                  <th scope="col" className="text-center">Popular</th>
                  <th scope="col" className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((p) => {
                  const draft = drafts[p.id];
                  const changed = draft !== undefined && draft !== String(p.price);
                  return (
                    <tr key={p.id} className={p.available ? '' : 'table-light text-muted'}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="osrjc-admin-thumb"><ProductThumb product={p} /></div>
                          <div>
                            <div className="fw-semibold">{p.name}</div>
                            <div className="small text-muted">
                              {categories.find((c) => c.id === p.category)?.name || p.category}
                              {p.brand ? ` · ${p.brand}` : ''}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ minWidth: 150 }}>
                        <div className="input-group input-group-sm">
                          <input
                            aria-label={`Price of ${p.name}`}
                            type="number"
                            min="0"
                            step="any"
                            inputMode="decimal"
                            className="form-control"
                            value={draft !== undefined ? draft : String(p.price)}
                            onChange={(e) => setDrafts((d) => ({ ...d, [p.id]: e.target.value }))}
                            onKeyDown={(e) => e.key === 'Enter' && changed && savePrice(p)}
                            disabled={busyId === p.id}
                          />
                          {changed && (
                            <button type="button" className="btn btn-success" onClick={() => savePrice(p)} disabled={busyId === p.id}>
                              Save
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="form-check form-switch d-inline-block m-0">
                          <input type="checkbox" role="switch" className="form-check-input" checked={p.available} onChange={() => toggle(p, 'available')} disabled={busyId === p.id} aria-label={`${p.name} available`} />
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="form-check form-switch d-inline-block m-0">
                          <input type="checkbox" role="switch" className="form-check-input" checked={!!p.featured} onChange={() => toggle(p, 'featured')} disabled={busyId === p.id} aria-label={`${p.name} popular`} />
                        </div>
                      </td>
                      <td className="text-end text-nowrap">
                        <button type="button" className="btn btn-sm btn-osrjc-outline me-1" onClick={() => setEditing(p)}>
                          <i className="bi bi-pencil-square" aria-hidden="true"></i> Edit
                        </button>
                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => remove(p)} disabled={busyId === p.id} aria-label={`Delete ${p.name}`}>
                          <i className="bi bi-trash3" aria-hidden="true"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editing && (
        <ProductForm
          product={editing === 'new' ? null : editing}
          categories={categories}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
};

export default AdminProducts;
