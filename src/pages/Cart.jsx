import { Link, useNavigate } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import CartItem from '../components/CartItem';
import EmptyState from '../components/EmptyState';
import PageMeta from '../components/PageMeta';
import { SHOP_INFO } from '../config/shop';
import { useCart } from '../context/CartContext';
import { computeTotals, formatCurrency } from '../utils/helpers';

const Cart = () => {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const { subtotal, deliveryFee, total, itemCount } = computeTotals(items);

  return (
    <>
      <PageMeta title="Your Cart" description="Review the items in your Om Sai Ram Juice Center cart before checkout." />
      <Container fluid="lg" className="py-4">
        <h1 className="h2 fw-bold mb-1">Your Cart</h1>
        <p className="text-muted mb-4">
          <i className="bi bi-truck me-1" aria-hidden="true"></i>
          Online delivery is available only within {SHOP_INFO.deliveryRadiusMeters} meters of the shop in Sirpur.
        </p>

        {items.length === 0 ? (
          <EmptyState
            icon="bi-cart-x"
            title="Your cart is empty"
            text="Looks like you haven't added anything yet."
            actionLabel="Continue Shopping"
            actionTo="/menu"
          />
        ) : (
          <Row className="g-4">
            <Col lg={8}>
              <div className="card border-0 shadow-sm p-3 p-md-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h2 className="h6 mb-0 text-muted">
                    {items.length} item{items.length === 1 ? '' : 's'} ({itemCount} qty)
                  </h2>
                  <button type="button" className="btn btn-sm btn-outline-danger" onClick={clearCart}>
                    <i className="bi bi-trash3 me-1" aria-hidden="true"></i>Clear Cart
                  </button>
                </div>
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
              <Link to="/menu" className="btn btn-osrjc-outline mt-3">
                <i className="bi bi-arrow-left me-1" aria-hidden="true"></i>Continue Shopping
              </Link>
            </Col>

            <Col lg={4}>
              <div className="osrjc-order-summary card border-0 shadow-sm p-4">
                <h2 className="h5 fw-bold mb-3">Order Summary</h2>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Delivery Fee</span>
                  <span className="text-success fw-semibold">{deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-3 fs-5 fw-bold">
                  <span>Grand Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                <button type="button" className="btn btn-osrjc-primary w-100 btn-lg" onClick={() => navigate('/checkout')}>
                  Proceed to Checkout <i className="bi bi-arrow-right ms-1" aria-hidden="true"></i>
                </button>
                <p className="small text-muted mt-3 mb-0 text-center">
                  <i className="bi bi-info-circle me-1" aria-hidden="true"></i>
                  Delivery available only within {SHOP_INFO.deliveryRadiusMeters} meters of Om Sai Ram Juice Center, Sirpur.
                </p>
              </div>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
};

export default Cart;
