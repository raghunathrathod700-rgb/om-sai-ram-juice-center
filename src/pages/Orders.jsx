import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Badge, Col, Container, Row } from 'react-bootstrap';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import PageMeta from '../components/PageMeta';
import { USE_API } from '../config/shop';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import {
  advanceOrderStatus,
  getOrdersForUser,
  markPaymentVerified,
  payAgain,
  supportsDemoControls,
  verifyPayment,
} from '../services/orderService';
import { payServerOrder } from '../services/paymentService';
import { getProductSync } from '../services/productService';
import {
  formatCurrency,
  formatDate,
  FULFILMENT,
  getStatusFlow,
  orderStatusVariant,
  PAYMENT_METHODS,
  PAYMENT_STATUS,
  paymentMethodLabel,
  paymentStatusVariant,
} from '../utils/helpers';

const OrderTimeline = ({ order }) => {
  const flow = getStatusFlow(order.fulfilment);
  const current = flow.indexOf(order.status);
  return (
    <ol className="osrjc-order-timeline" aria-label="Order progress">
      {flow.map((step, idx) => (
        <li key={step} className={`osrjc-timeline-step ${idx <= current ? 'done' : ''}`} aria-current={idx === current ? 'step' : undefined}>
          <span className="osrjc-timeline-dot"></span>
          <span className="osrjc-timeline-label">{step}</span>
        </li>
      ))}
    </ol>
  );
};

const Orders = () => {
  const { user } = useAuth();
  const { addToCart, openDrawer } = useCart();
  const { showToast } = useToast();
  const location = useLocation();
  const [orders, setOrders] = useState(null); // null = still loading
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState('');
  const newOrderId = location.state?.newOrderId;

  const load = useCallback(async () => {
    try {
      setOrders(await getOrdersForUser(user.id));
      setError('');
    } catch (err) {
      setError(err.message || 'Could not load your orders.');
    }
  }, [user.id]);

  useEffect(() => {
    load();
  }, [load]);

  const reorder = (order) => {
    let added = 0;
    order.items.forEach((line) => {
      const product = getProductSync(line.id);
      if (product && product.available) {
        addToCart(product, line.quantity);
        added += 1;
      }
    });
    if (added) {
      showToast('Items added to your cart.', 'success', 'bi-cart-check-fill');
      openDrawer();
    } else {
      showToast('These items are not available right now.', 'warning');
    }
  };

  /** backend mode: finish an online payment that was cancelled or failed earlier */
  const payNow = async (order) => {
    setBusyId(order.id);
    try {
      const info = await payAgain(order.id);
      const response = await payServerOrder(
        info,
        { name: order.deliveryInfo.fullName, mobile: order.deliveryInfo.mobile, email: user.email },
        `Order ${order.id}`
      );
      await verifyPayment({ orderId: order.id, ...response });
      showToast('Payment successful!', 'success');
      await load();
    } catch (err) {
      showToast(err.cancelled ? 'Payment cancelled.' : err.message, err.cancelled ? 'warning' : 'danger');
    } finally {
      setBusyId('');
    }
  };

  return (
    <>
      <PageMeta title="My Orders" description="View your order history at Om Sai Ram Juice Center." />
      <Container fluid="lg" className="py-4">
        <h1 className="h2 fw-bold mb-4">My Orders</h1>

        {newOrderId && (
          <div className="alert alert-success d-flex align-items-center gap-2" role="status">
            <i className="bi bi-check-circle-fill fs-5" aria-hidden="true"></i>
            <span>
              Your order <strong>{newOrderId}</strong> has been placed successfully!
            </span>
          </div>
        )}

        {error ? (
          <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
            <span>{error}</span>
            <button type="button" className="btn btn-sm btn-outline-danger" onClick={load}>
              Try again
            </button>
          </div>
        ) : orders === null ? (
          <LoadingSpinner text="Loading your orders..." />
        ) : orders.length === 0 ? (
          <EmptyState
            icon="bi-receipt"
            title="No orders yet"
            text="When you place an order, it will show up here."
            actionLabel="Browse Menu"
            actionTo="/menu"
          />
        ) : (
          <div className="d-flex flex-column gap-4">
            {orders.map((order) => {
              const cancelled = order.status === 'Cancelled';
              const needsPayment =
                USE_API &&
                order.payment.method === PAYMENT_METHODS.ONLINE &&
                order.payment.status === PAYMENT_STATUS.AWAITING_PAYMENT &&
                !cancelled;
              return (
                <article key={order.id} className="osrjc-order-card card border-0 shadow-sm p-4">
                  <Row className="g-3">
                    <Col md={8}>
                      <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                        <h2 className="h6 mb-0">Order #{order.id}</h2>
                        <Badge bg={orderStatusVariant(order.status)}>{order.status}</Badge>
                        <Badge bg="light" text="dark" className="border">
                          {order.fulfilment === FULFILMENT.PICKUP ? 'Self Pickup' : 'Home Delivery'}
                        </Badge>
                      </div>
                      <p className="text-muted small mb-2">
                        <i className="bi bi-calendar3 me-1" aria-hidden="true"></i>
                        {formatDate(order.createdAt)}
                      </p>
                      <ul className="small text-muted osrjc-order-item-list mb-2">
                        {order.items.map((item) => (
                          <li key={item.id}>
                            {item.name} × {item.quantity} — {formatCurrency(item.price * item.quantity)}
                          </li>
                        ))}
                      </ul>
                      <p className="small text-muted mb-0">
                        <i className="bi bi-geo-alt me-1" aria-hidden="true"></i>
                        {order.deliveryInfo.address}
                        {order.deliveryInfo.pincode ? `, ${order.deliveryInfo.pincode}` : ''}
                      </p>
                    </Col>
                    <Col md={4} className="text-md-end">
                      <div className="fs-4 fw-bold">{formatCurrency(order.total)}</div>
                      <div className="small text-muted mb-1">{paymentMethodLabel(order.payment.method)}</div>
                      <Badge bg={paymentStatusVariant(order.payment.status)}>{order.payment.status}</Badge>
                      {order.payment.paymentId && (
                        <div className="small text-muted mt-1 text-break">Ref: {order.payment.paymentId}</div>
                      )}
                    </Col>
                  </Row>

                  {!cancelled && <OrderTimeline order={order} />}
                  {cancelled && <div className="alert alert-danger small mt-3 mb-0">This order was cancelled.</div>}

                  <div className="d-flex flex-wrap gap-2 mt-3 pt-3 border-top">
                    {needsPayment && (
                      <button type="button" className="btn btn-sm btn-osrjc-primary" onClick={() => payNow(order)} disabled={busyId === order.id}>
                        <i className="bi bi-credit-card me-1" aria-hidden="true"></i>
                        {busyId === order.id ? 'Opening payment...' : `Pay ${formatCurrency(order.total)} now`}
                      </button>
                    )}
                    <button type="button" className="btn btn-sm btn-osrjc-outline" onClick={() => reorder(order)}>
                      <i className="bi bi-arrow-repeat me-1" aria-hidden="true"></i>Order again
                    </button>
                    {supportsDemoControls && (
                      <>
                        <span className="ms-auto small text-muted align-self-center">Demo controls:</span>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => {
                            advanceOrderStatus(order.id, user.id);
                            load();
                          }}
                          disabled={['Delivered', 'Picked Up'].includes(order.status)}
                        >
                          Next status
                        </button>
                        {order.payment.method === PAYMENT_METHODS.UPI_QR &&
                          order.payment.status === PAYMENT_STATUS.AWAITING_VERIFICATION && (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-success"
                              onClick={() => {
                                markPaymentVerified(order.id, user.id, PAYMENT_STATUS.PAID);
                                load();
                              }}
                            >
                              Shop verified payment
                            </button>
                          )}
                      </>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </Container>
    </>
  );
};

export default Orders;
