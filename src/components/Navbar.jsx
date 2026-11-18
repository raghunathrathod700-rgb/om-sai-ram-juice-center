import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Container, Offcanvas } from 'react-bootstrap';
import { SHOP_INFO } from '../config/shop';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useDebounce } from '../hooks/useDebounce';
import { searchProductsSync } from '../services/productService';
import { buildWhatsAppLink, formatCurrency } from '../utils/helpers';

const LINKS = [
  { to: '/', label: 'Home', end: true, icon: 'bi-house-door' },
  { to: '/menu', label: 'Menu', icon: 'bi-egg-fried' },
  { to: '/about', label: 'About', icon: 'bi-info-circle' },
  { to: '/delivery', label: 'Delivery', icon: 'bi-bicycle' },
  { to: '/contact', label: 'Contact', icon: 'bi-telephone' },
];

const Brand = ({ onClick }) => (
  <Link to="/" className="osrjc-brand" onClick={onClick} aria-label="Om Sai Ram Juice Center — home">
    <span className="osrjc-brand-icon" aria-hidden="true">
      <i className="bi bi-cup-straw"></i>
    </span>
    <span className="osrjc-brand-text">
      <span className="line1">Om Sai Ram</span>
      <span className="line2">Juice Center</span>
    </span>
  </Link>
);

const AppNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [term, setTerm] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { itemCount, openDrawer } = useCart();
  const { isAuthenticated, isAdmin, user } = useAuth();

  const debouncedTerm = useDebounce(term, 200);
  const suggestions = useMemo(() => searchProductsSync(debouncedTerm, 5), [debouncedTerm]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeSearch = () => {
    setSearchOpen(false);
    setTerm('');
  };
  const closeMenu = () => setMenuOpen(false);

  const submitSearch = (e) => {
    e.preventDefault();
    const q = term.trim();
    if (!q) return;
    navigate(`/menu?q=${encodeURIComponent(q)}`);
    closeSearch();
  };

  const owner = SHOP_INFO.owners[0];
  const accountLink = isAuthenticated ? '/profile' : '/login';

  return (
    <header className={`osrjc-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="osrjc-tagline-strip">
        <i className="bi bi-patch-check-fill me-1" aria-hidden="true"></i> Fresh &bull; Hygienic &bull; Fast
        <span className="d-none d-md-inline">
          {' '}
          &nbsp;|&nbsp; Delivery within {SHOP_INFO.deliveryRadiusMeters} m of the shop
        </span>
      </div>

      <Container fluid="lg" className="osrjc-navbar-inner">
        <Brand />

        <nav className="osrjc-nav-links d-none d-lg-flex" aria-label="Main navigation">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className="nav-link">
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="osrjc-nav-actions">
          <button type="button" className="osrjc-icon-btn" onClick={() => setSearchOpen(true)} aria-label="Search products">
            <i className="bi bi-search" aria-hidden="true"></i>
          </button>
          <button
            type="button"
            className="osrjc-icon-btn position-relative"
            data-cart-target
            onClick={openDrawer}
            aria-label={`Open cart, ${itemCount} items`}
          >
            <i className="bi bi-cart3" aria-hidden="true"></i>
            {itemCount > 0 && (
              <span key={itemCount} className="osrjc-cart-badge">
                {itemCount}
              </span>
            )}
          </button>
          {isAdmin && (
            <Link to="/admin" className="btn btn-osrjc-primary btn-sm d-none d-lg-inline-flex align-items-center gap-1">
              <i className="bi bi-speedometer2" aria-hidden="true"></i>Admin
            </Link>
          )}
          {isAuthenticated ? (
            <Link to="/profile" className="btn btn-osrjc-outline btn-sm d-none d-lg-inline-flex align-items-center gap-1">
              <i className="bi bi-person-circle" aria-hidden="true"></i>
              {user?.fullName?.split(' ')[0]}
            </Link>
          ) : (
            <Link to="/login" className="btn btn-osrjc-primary btn-sm d-none d-lg-inline-flex">
              Login
            </Link>
          )}
          <button
            type="button"
            className="osrjc-icon-btn d-lg-none"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
          >
            <i className="bi bi-list" aria-hidden="true"></i>
          </button>
        </div>
      </Container>

      <div className="osrjc-scroll-progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${progress})` }}></span>
      </div>

      {/* ---------- mobile navigation drawer ---------- */}
      <Offcanvas show={menuOpen} onHide={closeMenu} placement="start" className="osrjc-menu-drawer" aria-labelledby="menu-drawer-title">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title id="menu-drawer-title">
            <Brand onClick={closeMenu} />
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="d-flex flex-column">
          <nav className="osrjc-drawer-links" aria-label="Mobile navigation">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className="osrjc-drawer-link" onClick={closeMenu}>
                <i className={`bi ${l.icon}`} aria-hidden="true"></i>
                {l.label}
              </NavLink>
            ))}
            <NavLink to="/cart" className="osrjc-drawer-link" onClick={closeMenu}>
              <i className="bi bi-cart3" aria-hidden="true"></i>Cart {itemCount > 0 && <span className="badge bg-danger ms-auto">{itemCount}</span>}
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin" className="osrjc-drawer-link" onClick={closeMenu}>
                <i className="bi bi-speedometer2" aria-hidden="true"></i>Admin Panel
              </NavLink>
            )}
            {isAuthenticated && (
              <NavLink to="/orders" className="osrjc-drawer-link" onClick={closeMenu}>
                <i className="bi bi-receipt" aria-hidden="true"></i>My Orders
              </NavLink>
            )}
          </nav>
          <div className="mt-auto pt-3 d-grid gap-2">
            <Link to={accountLink} className="btn btn-osrjc-primary" onClick={closeMenu}>
              {isAuthenticated ? 'My Profile' : 'Login / Register'}
            </Link>
            <a href={buildWhatsAppLink(owner.phone, 'Hello, I want to order from Om Sai Ram Juice Center.')} target="_blank" rel="noopener noreferrer" className="btn btn-success">
              <i className="bi bi-whatsapp me-1" aria-hidden="true"></i>Order on WhatsApp
            </a>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* ---------- search ---------- */}
      <Offcanvas show={searchOpen} onHide={closeSearch} placement="top" className="osrjc-search-offcanvas" onEntered={() => inputRef.current?.focus()}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Search our menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <form onSubmit={submitSearch} className="d-flex gap-2">
            <label htmlFor="nav-search" className="visually-hidden">
              Search products
            </label>
            <input
              id="nav-search"
              ref={inputRef}
              type="search"
              className="form-control form-control-lg"
              placeholder='Try "mango", "faluda", "ice cream"...'
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              autoComplete="off"
            />
            <button type="submit" className="btn btn-osrjc-primary px-4">
              <i className="bi bi-search" aria-hidden="true"></i>
              <span className="d-none d-sm-inline ms-1">Search</span>
            </button>
          </form>

          {debouncedTerm.trim() && (
            <ul className="list-group mt-3 osrjc-suggestions">
              {suggestions.length === 0 ? (
                <li className="list-group-item text-muted">No matching items found.</li>
              ) : (
                suggestions.map((p) => (
                  <li key={p.id} className="list-group-item p-0">
                    <Link
                      to={`/product/${p.id}`}
                      className="d-flex justify-content-between align-items-center px-3 py-2 text-decoration-none text-reset"
                      onClick={closeSearch}
                    >
                      <span>
                        {p.name}
                        {p.brand && <small className="text-muted"> • {p.brand}</small>}
                      </span>
                      <strong>{formatCurrency(p.price)}</strong>
                    </Link>
                  </li>
                ))
              )}
            </ul>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </header>
  );
};

export default AppNavbar;
