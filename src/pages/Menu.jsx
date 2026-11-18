import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import CatalogError from '../components/CatalogError';
import CategoryFilter from '../components/CategoryFilter';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import PageMeta from '../components/PageMeta';
import ProductCard from '../components/ProductCard';
import Reveal from '../components/Reveal';
import { SHOP_INFO } from '../config/shop';
import { useFavourites } from '../context/FavouritesContext';
import { ICE_CREAM_BRANDS } from '../data/products';
import { useDebounce } from '../hooks/useDebounce';
import { useProducts } from '../hooks/useProducts';

const SORTS = [
  { id: 'popular', label: 'Featured' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'name', label: 'Name: A to Z' },
];

const sortList = (list, sort) => {
  const copy = [...list];
  if (sort === 'price-asc') return copy.sort((a, b) => a.price - b.price || a.name.localeCompare(b.name));
  if (sort === 'price-desc') return copy.sort((a, b) => b.price - a.price || a.name.localeCompare(b.name));
  if (sort === 'name') return copy.sort((a, b) => a.name.localeCompare(b.name));
  return copy; // 'Featured' = the order in products.js
};

const Menu = () => {
  const { products, categories, loading, error } = useProducts();
  const { favouriteIds, favouriteCount } = useFavourites();
  const [params, setParams] = useSearchParams();

  const category = params.get('category') || 'all';
  const q = params.get('q') || '';
  const sort = params.get('sort') || 'popular';
  const brand = params.get('brand') || 'all';
  const favOnly = params.get('fav') === '1';

  // All filters live in the URL, so every filtered view can be shared / bookmarked.
  const updateParams = useCallback(
    (patch, replace = false) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          Object.entries(patch).forEach(([key, value]) => {
            const isDefault =
              value === '' || value == null || value === 'all' || (key === 'sort' && value === 'popular') || (key === 'fav' && value !== '1');
            if (isDefault) next.delete(key);
            else next.set(key, value);
          });
          return next;
        },
        { replace }
      );
    },
    [setParams]
  );

  // search box: local state for instant typing, debounced into the URL
  const [searchText, setSearchText] = useState(q);
  const debouncedSearch = useDebounce(searchText, 300);
  useEffect(() => {
    setSearchText(q);
  }, [q]);
  useEffect(() => {
    if (debouncedSearch !== q) updateParams({ q: debouncedSearch }, true); // not trimmed: the box must keep the space the user just typed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const visible = useMemo(() => {
    const term = q.trim().toLowerCase();
    const list = products.filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (brand !== 'all' && p.brand !== brand) return false;
      if (favOnly && !favouriteIds.includes(p.id)) return false;
      if (!term) return true;
      return [p.name, p.brand, p.category.replace('-', ' '), p.description]
        .filter(Boolean)
        .some((text) => text.toLowerCase().includes(term));
    });
    return sortList(list, sort);
  }, [products, category, brand, favOnly, favouriteIds, q, sort]);

  const hasFilters = category !== 'all' || q || brand !== 'all' || favOnly || sort !== 'popular';

  return (
    <>
      <PageMeta
        title="Our Menu — Fresh Juices, Lassi, Faluda & Ice Cream"
        description="Browse the full menu at Om Sai Ram Juice Center, Sirpur — fresh juices, traditional drinks, shakes, faluda, ice creams and special combos."
      />

      <div className="osrjc-page-header">
        <Container fluid="lg">
          <h1 className="h2 fw-bold mb-1">Our Menu</h1>
          <p className="text-muted mb-0">
            <i className="bi bi-truck me-1" aria-hidden="true"></i>
            Online delivery is available only within {SHOP_INFO.deliveryRadiusMeters} meters of {SHOP_INFO.name}, Sirpur.
          </p>
        </Container>
      </div>

      <Container fluid="lg" className="py-4">
        <Row className="g-3 align-items-end mb-3">
          <Col md={6} lg={5}>
            <label htmlFor="menu-search" className="visually-hidden">
              Search menu
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-search" aria-hidden="true"></i>
              </span>
              <input
                id="menu-search"
                type="search"
                className="form-control"
                placeholder='Search "mango", "faluda", "ice cream"...'
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </Col>
          <Col xs={7} md={3} lg={3}>
            <label htmlFor="menu-sort" className="form-label small mb-1">
              Sort by
            </label>
            <select
              id="menu-sort"
              className="form-select"
              value={sort}
              onChange={(e) => updateParams({ sort: e.target.value })}
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </Col>
          <Col xs={5} md={3} lg={4}>
            <button
              type="button"
              className={`btn w-100 ${favOnly ? 'btn-danger' : 'btn-outline-danger'}`}
              aria-pressed={favOnly}
              onClick={() => updateParams({ fav: favOnly ? '' : '1' })}
            >
              <i className={`bi ${favOnly ? 'bi-heart-fill' : 'bi-heart'} me-1`} aria-hidden="true"></i>
              Favourites ({favouriteCount})
            </button>
          </Col>
        </Row>

        <CategoryFilter
          categories={categories}
          active={category}
          onSelect={(id) => updateParams({ category: id, brand: '' })}
        />

        {category === 'ice-cream' && (
          <div className="osrjc-brand-filter" role="group" aria-label="Filter ice cream by brand">
            <span className="small fw-semibold me-1">Brand:</span>
            {['all', ...ICE_CREAM_BRANDS].map((b) => (
              <button
                key={b}
                type="button"
                aria-pressed={brand === b}
                className={`osrjc-brand-pill ${brand === b ? 'active' : ''}`}
                onClick={() => updateParams({ brand: b })}
              >
                {b === 'all' ? 'All brands' : b}
              </button>
            ))}
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center mt-4">
          <p className="text-muted small mb-0" aria-live="polite">
            {loading ? 'Loading…' : `${visible.length} item${visible.length === 1 ? '' : 's'} found`}
          </p>
          {hasFilters && (
            <button
              type="button"
              className="btn btn-link btn-sm text-decoration-none"
              onClick={() => {
                setSearchText('');
                setParams({});
              }}
            >
              <i className="bi bi-x-circle me-1" aria-hidden="true"></i>Clear all filters
            </button>
          )}
        </div>

        <div className="mt-3">
          {loading ? (
            <LoadingSpinner text="Loading menu items..." />
          ) : error && products.length === 0 ? (
            <CatalogError error={error} />
          ) : visible.length === 0 ? (
            <EmptyState
              title="No products found"
              text={favOnly ? 'You have no favourites here yet — tap the heart on any item.' : 'Try a different search term or category.'}
            />
          ) : (
            <Row className="g-3 g-md-4">
              {visible.map((p, i) => (
                <Col key={p.id} xs={6} md={4} lg={3}>
                  <Reveal delay={(i % 4) * 70} className="h-100">
                    <ProductCard product={p} />
                  </Reveal>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </Container>
    </>
  );
};

export default Menu;
