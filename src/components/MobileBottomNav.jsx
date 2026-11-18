import { NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ITEMS = [
  { to: '/', label: 'Home', icon: 'bi-house-door', end: true },
  { to: '/menu', label: 'Menu', icon: 'bi-egg-fried' },
  { to: '/cart', label: 'Cart', icon: 'bi-cart3', cart: true },
  { to: '/orders', label: 'Orders', icon: 'bi-receipt' },
  { to: '/profile', label: 'Profile', icon: 'bi-person' },
];

const MobileBottomNav = () => {
  const { itemCount } = useCart();
  return (
    <nav className="osrjc-mobile-bottom-nav d-lg-none" aria-label="Mobile bottom navigation">
      {ITEMS.map((item) => (
        <NavLink key={item.to} to={item.to} end={item.end} className="osrjc-bottom-nav-item">
          <i className={`bi ${item.icon}`} aria-hidden="true"></i>
          {item.cart && itemCount > 0 && <span className="osrjc-bottom-nav-badge">{itemCount}</span>}
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default MobileBottomNav;
