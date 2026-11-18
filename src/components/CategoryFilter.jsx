const CategoryFilter = ({ categories, active, onSelect }) => (
  <div className="osrjc-category-scroll" role="group" aria-label="Filter products by category">
    <button
      type="button"
      aria-pressed={active === 'all'}
      className={`osrjc-category-chip ${active === 'all' ? 'active' : ''}`}
      onClick={() => onSelect('all')}
    >
      <i className="bi bi-grid-fill" aria-hidden="true"></i>
      <span>All Items</span>
    </button>
    {categories.map((cat) => (
      <button
        type="button"
        key={cat.id}
        aria-pressed={active === cat.id}
        className={`osrjc-category-chip ${active === cat.id ? 'active' : ''}`}
        onClick={() => onSelect(cat.id)}
      >
        <i className={`bi ${cat.icon}`} aria-hidden="true"></i>
        <span>{cat.name}</span>
      </button>
    ))}
  </div>
);

export default CategoryFilter;
