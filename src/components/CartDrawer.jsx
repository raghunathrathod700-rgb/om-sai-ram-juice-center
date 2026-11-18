import { Link } from 'react-router-dom';
import { Offcanvas } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { SHOP_INFO } from '../config/shop';
import { formatCurrency } from '../utils/helpers';
import CartItem from './CartItem';

/** Slide-in mini cart (Offcanvas) opened from the navbar cart icon. */
const CartDrawer = () => {
  const { items, subtotal, itemCount, drawerOpen, closeDrawer } = useCart();

  return (
    <Offcanvas show={drawerOpen} onHide={closeDrawer} placement="end" className="osrjc-cart-drawer" aria-labelledby="cart-drawer-title">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title id="cart-drawer-title">
          <i className="bi bi-cart3 me-2" aria-hidden="true"></i>Your Cart ({itemCount})
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="d-flex flex-column">
        {items.length === 0 ? (
          <div className="text-center text-muted my-auto">
            <i className="bi bi-cart-x display-4 d-block mb-2" aria-hidden="true"></i>
            <p>Your cart is empty.</p>
            <Link to="/menu" className="btn btn-osrjc-primary" onClick={closeDrawer}>
              Browse Menu
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-grow-1 overflow-auto">
              {items.map((item) => (
                <CartItem key={item.id} item={item} compact />
              ))}
            </div>
            <div className="pt-3 border-top">
              <div className="d-flex justify-content-between fw-bold fs-5 mb-2">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <p className="small text-muted">
                <i className="bi bi-truck me-1" aria-hidden="true"></i>
                Delivery only within {SHOP_INFO.deliveryRadiusMeters} meters of the shop.
              </p>
              <div className="d-grid gap-2">
                <Link to="/checkout" className="btn btn-osrjc-primary" onClick={closeDrawer}>
                  Proceed to Checkout
                </Link>
                <Link to="/cart" className="btn btn-osrjc-outline" onClick={closeDrawer}>
                  View Full Cart
                </Link>
              </div>
            </div>
          </>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default CartDrawer;
