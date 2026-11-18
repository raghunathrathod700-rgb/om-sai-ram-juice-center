import { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { useProducts } from '../../hooks/useProducts';
import { createCategory, deleteCategory } from '../../services/adminService';

const ICONS = [
  ['bi-cup-straw', 'Straw cup'],
  ['bi-cup', 'Cup'],
  ['bi-cup-hot', 'Hot cup'],
  ['bi-egg-fried', 'Bowl'],
  ['bi-snow2', 'Ice cream'],
  ['bi-stars', 'Special'],
  ['bi-cake2', 'Cake'],
  ['bi-basket', 'Basket'],
];

const AdminCategories = () => {
  const { products, categories } = useProducts();
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('bi-cup-straw');
  const [busy, setBusy] = useState(false);

  const add = async (e) => {
    e.preventDefault();
    if (!name.trim()) return showToast('Enter a category name.', 'danger');
    setBusy(true);
    try {
      await createCategory(name.trim(), icon);
      setName('');
      showToast('Category added.', 'success');
    } catch (err) {
      showToast(err.message, 'danger');
    } finally {
      setBusy(false);
    }
    return undefined;
  };

  const remove = async (c) => {
    if (!window.confirm(`Delete the category "${c.name}"?`)) return;
    try {
      await deleteCategory(c.id);
      showToast('Category deleted.', 'success');
    } catch (err) {
      showToast(err.message, 'danger');
    }
  };

  return (
    <div className="row g-4">
      <div className="col-lg-7">
        <div className="card border-0 shadow-sm p-3 p-md-4">
          <h2 className="h6 fw-bold mb-3">Categories</h2>
          {categories.map((c) => {
            const count = products.filter((p) => p.category === c.id).length;
            return (
              <div key={c.id} className="d-flex align-items-center gap-3 py-2 border-top">
                <i className={`bi ${c.icon} fs-5 text-osrjc-orange`} aria-hidden="true"></i>
                <div className="flex-grow-1">
                  <div className="fw-semibold">{c.name}</div>
                  <div className="small text-muted">{count} item{count === 1 ? '' : 's'}</div>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => remove(c)}
                  disabled={count > 0}
                  title={count > 0 ? 'Move or delete its items first' : 'Delete category'}
                  aria-label={`Delete ${c.name}`}
                >
                  <i className="bi bi-trash3" aria-hidden="true"></i>
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <div className="col-lg-5">
        <form className="card border-0 shadow-sm p-3 p-md-4" onSubmit={add} noValidate>
          <h2 className="h6 fw-bold mb-3">Add a category</h2>
          <label htmlFor="cat-name" className="form-label">Name</label>
          <input id="cat-name" className="form-control mb-3" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} placeholder="e.g. Cold Coffee" />
          <label htmlFor="cat-icon" className="form-label">Icon</label>
          <select id="cat-icon" className="form-select mb-3" value={icon} onChange={(e) => setIcon(e.target.value)}>
            {ICONS.map(([id, label]) => (
              <option key={id} value={id}>{label}</option>
            ))}
          </select>
          <button type="submit" className="btn btn-osrjc-primary" disabled={busy}>
            {busy ? 'Adding...' : 'Add category'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminCategories;
