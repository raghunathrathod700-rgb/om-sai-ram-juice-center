import { loadCatalog } from '../services/catalogStore';

/** Shown instead of an empty menu when the shop server could not be reached. */
const CatalogError = ({ error }) => (
  <div className="alert alert-danger d-flex flex-wrap justify-content-between align-items-center gap-2" role="alert">
    <span>
      <i className="bi bi-wifi-off me-2" aria-hidden="true"></i>
      {error?.message || 'The menu could not be loaded.'}
    </span>
    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => loadCatalog(true)}>
      Try again
    </button>
  </div>
);

export default CatalogError;
