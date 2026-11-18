import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import DeliveryChecker from '../components/DeliveryChecker';
import DemoPaymentModal from '../components/DemoPaymentModal';
import EmptyState from '../components/EmptyState';
import FormField from '../components/FormField';
import PageMeta from '../components/PageMeta';
import PaymentSection from '../components/PaymentSection';
import { SHOP_INFO, USE_API } from '../config/shop';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { createOrder, placeOrder, verifyPayment } from '../services/orderService';
import { getOnlineConfig, getPaymentMode, PAYMENT_MODES, payServerOrder, payWithRazorpay } from '../services/paymentService';
import {
  computeTotals,
  formatCurrency,
  FULFILMENT,
  generateId,
  isValidMobile,
  isValidPincode,
  PAYMENT_METHODS,
  PAYMENT_STATUS,
} from '../utils/helpers';

const Checkout = () => {
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [fulfilment, setFulfilment] = useState(FULFILMENT.DELIVERY);
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    mobile: user?.mobile || '',
    address: user?.address || '',
    landmark: '',
    pincode: '',
  });
  const [errors, setErrors] = useState({});
  const [deliveryResult, setDeliveryResult] = useState(null);
  const [method, setMethod] = useState(PAYMENT_METHODS.COD);
  const [utr, setUtr] = useState('');
  const [placing, setPlacing] = useState(false);
  const [payError, setPayError] = useState('');
  const [demoOpen, setDemoOpen] = useState(false);
  const [onlineEnabled, setOnlineEnabled] = useState(true);

  useEffect(() => {
    getOnlineConfig().then((cfg) => {
      setOnlineEnabled(!!cfg.enabled);
      if (!cfg.enabled) setMethod((m) => (m === PAYMENT_METHODS.ONLINE ? PAYMENT_METHODS.COD : m));
    });
  }, []);

  // one id per checkout visit: used as Razorpay receipt, UPI note and the order id
  const orderRef = useMemo(() => generateId('OSR'), []);
  const totals = computeTotals(items, fulfilment);
  const isDelivery = fulfilment === FULFILMENT.DELIVERY;

  if (items.length === 0 && !placing) {
    return (
      <Container fluid="lg" className="py-5">
        <EmptyState
          icon="bi-cart-x"
          title="Your cart is empty"
          text="Add some delicious items before checking out."
          actionLabel="Browse Menu"
          actionTo="/menu"
        />
      </Container>
    );
  }

  const setField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = 'Full name is required.';
    if (!isValidMobile(form.mobile)) next.mobile = 'Enter a valid 10-digit mobile number.';
    if (isDelivery) {
      if (!form.address.trim()) next.address = 'Delivery address is required.';
      if (!isValidPincode(form.pincode)) next.pincode = 'Enter a valid 6-digit pincode.';
      if (!deliveryResult) next.delivery = 'Please check delivery availability for your address first.';
      else if (!deliveryResult.eligible)
        next.delivery = `Sorry, delivery is available only within ${SHOP_INFO.deliveryRadiusMeters} meters. You can choose Self Pickup instead.`;
    }
    if (method === PAYMENT_METHODS.UPI_QR && !/^[A-Za-z0-9]{8,22}$/.test(utr.trim())) {
      next.utr = 'Enter the UPI transaction / UTR number shown in your payment app.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const finalize = (payment) => {
    const order = createOrder({
      id: orderRef,
      userId: user.id,
      items,
      fulfilment,
      deliveryInfo: {
        fullName: form.fullName.trim(),
        mobile: form.mobile.trim(),
        address: isDelivery ? form.address.trim() : `Self pickup at ${SHOP_INFO.name}`,
        landmark: isDelivery ? form.landmark.trim() : '',
        pincode: isDelivery ? form.pincode.trim() : '',
      },
      payment,
      totals,
    });
    showToast('Order placed successfully!', 'success');
    navigate('/orders', { state: { newOrderId: order.id } });
    clearCart();
  };

  /** Backend mode: the SERVER prices and stores the order (the browser only sends product ids + quantities). */
  const submitToServer = async () => {
    const { order, razorpay } = await placeOrder({
      fulfilment,
      items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
      contact: {
        fullName: form.fullName.trim(),
        mobile: form.mobile.trim(),
        address: isDelivery ? form.address.trim() : '',
        landmark: isDelivery ? form.landmark.trim() : '',
        pincode: isDelivery ? form.pincode.trim() : '',
      },
      paymentMethod: method,
      utr: method === PAYMENT_METHODS.UPI_QR ? utr.trim() : undefined,
      latitude: deliveryResult?.coords?.lat,
      longitude: deliveryResult?.coords?.lng,
    });

    if (method === PAYMENT_METHODS.ONLINE && razorpay) {
      try {
        const response = await payServerOrder(
          razorpay,
          { name: form.fullName.trim(), mobile: form.mobile.trim(), email: user.email },
          `Order ${order.id}`
        );
        await verifyPayment({ orderId: order.id, ...response });
        showToast('Payment successful!', 'success');
      } catch (err) {
        // the order exists; the customer can pay again from "My Orders"
        showToast(err.cancelled ? 'Payment not completed. You can pay again from My Orders.' : err.message, 'warning');
      }
    } else {
      showToast('Order placed successfully!', 'success');
    }
    navigate('/orders', { state: { newOrderId: order.id } });
    clearCart();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (placing) return;
    setPayError('');
    if (!validate()) {
      showToast('Please fix the highlighted fields.', 'danger');
      return;
    }
    setPlacing(true);
    try {
      if (USE_API) {
        await submitToServer();
      } else if (method === PAYMENT_METHODS.COD) {
        finalize({ method, status: PAYMENT_STATUS.PENDING_COD, paymentId: null, mode: 'cod' });
      } else if (method === PAYMENT_METHODS.UPI_QR) {
        // never auto-paid: the shop verifies the UTR manually
        finalize({ method, status: PAYMENT_STATUS.AWAITING_VERIFICATION, paymentId: utr.trim(), mode: 'upi-qr' });
      } else if (getPaymentMode() === PAYMENT_MODES.DEMO) {
        setDemoOpen(true); // finalize() runs from the modal's onSuccess
      } else {
        const result = await payWithRazorpay({
          amount: totals.total,
          receiptId: orderRef,
          description: `Order ${orderRef}`,
          customer: { name: form.fullName.trim(), mobile: form.mobile.trim(), email: user.email },
          preferredMethod: undefined,
        });
        finalize({
          method,
          status: result.verified ? PAYMENT_STATUS.PAID : PAYMENT_STATUS.AWAITING_VERIFICATION,
          paymentId: result.paymentId,
          mode: result.mode,
        });
      }
    } catch (err) {
      if (err.cancelled) showToast('Payment cancelled. Your cart is safe.', 'warning');
      else setPayError(err.message || 'Something went wrong. Please try again.');
      setPlacing(false);
    }
  };

  const placeLabel = method === PAYMENT_METHODS.ONLINE ? `Pay ${formatCurrency(totals.total)} & Place Order` : 'Place Order';

  return (
    <>
      <PageMeta title="Checkout" description="Complete your order from Om Sai Ram Juice Center, Sirpur." />
      <Container fluid="lg" className="py-4">
        <h1 className="h2 fw-bold mb-4">Checkout</h1>

        <form onSubmit={handleSubmit} noValidate>
          <Row className="g-4">
            <Col lg={7}>
              {/* Delivery or pickup */}
              <div className="card border-0 shadow-sm p-4 mb-4">
                <h2 className="h5 fw-bold mb-3">How do you want your order?</h2>
                <div className="row g-2" role="radiogroup" aria-label="Order type">
                  {[
                    { id: FULFILMENT.DELIVERY, label: 'Home Delivery', hint: `Within ${SHOP_INFO.deliveryRadiusMeters} m of the shop`, icon: 'bi-bicycle' },
                    { id: FULFILMENT.PICKUP, label: 'Self Pickup', hint: 'Collect from the shop — any distance', icon: 'bi-shop' },
                  ].map((opt) => (
                    <div key={opt.id} className="col-sm-6">
                      <label className={`osrjc-payment-option ${fulfilment === opt.id ? 'active' : ''}`}>
                        <input
                          type="radio"
                          name="fulfilment"
                          checked={fulfilment === opt.id}
                          onChange={() => setFulfilment(opt.id)}
                        />
                        <i className={`bi ${opt.icon}`} aria-hidden="true"></i>
                        <span>
                          <strong className="d-block">{opt.label}</strong>
                          <small className="text-muted">{opt.hint}</small>
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card border-0 shadow-sm p-4 mb-4">
                <h2 className="h5 fw-bold mb-3">
                  <i className="bi bi-person-lines-fill me-2" aria-hidden="true"></i>
                  {isDelivery ? 'Delivery Details' : 'Contact Details'}
                </h2>
                <Row className="g-3">
                  <Col md={6}>
                    <FormField id="co-name" label="Full Name" value={form.fullName} onChange={setField('fullName')} error={errors.fullName} autoComplete="name" />
                  </Col>
                  <Col md={6}>
                    <FormField id="co-mobile" label="Mobile Number" type="tel" inputMode="numeric" maxLength={10} value={form.mobile} onChange={setField('mobile')} error={errors.mobile} autoComplete="tel" />
                  </Col>
                  {isDelivery && (
                    <>
                      <Col xs={12}>
                        <FormField id="co-address" label="Delivery Address" as="textarea" rows={2} value={form.address} onChange={setField('address')} error={errors.address} placeholder="House no., street, area, Sirpur" />
                      </Col>
                      <Col md={6}>
                        <FormField id="co-landmark" label="Landmark (optional)" value={form.landmark} onChange={setField('landmark')} placeholder="Near Sirpur Chowk" />
                      </Col>
                      <Col md={6}>
                        <FormField id="co-pincode" label="Pincode" inputMode="numeric" maxLength={6} value={form.pincode} onChange={setField('pincode')} error={errors.pincode} />
                      </Col>
                    </>
                  )}
                </Row>
              </div>

              {isDelivery && (
                <div className="card border-0 shadow-sm p-4 mb-4">
                  <h2 className="h5 fw-bold mb-2">
                    <i className="bi bi-geo-alt me-2" aria-hidden="true"></i>Delivery Area
                  </h2>
                  <div className="osrjc-delivery-note mb-3">
                    Delivery available only within {SHOP_INFO.deliveryRadiusMeters} meters of Om Sai Ram Juice Center, Sirpur.
                  </div>
                  <DeliveryChecker showInput={false} address={form.address} onResult={setDeliveryResult} />
                  {errors.delivery && (
                    <div className="alert alert-danger small mt-3 mb-0" role="alert">
                      {errors.delivery}
                    </div>
                  )}
                </div>
              )}

              <div className="card border-0 shadow-sm p-4">
                <h2 className="h5 fw-bold mb-3">
                  <i className="bi bi-wallet2 me-2" aria-hidden="true"></i>Payment Method
                </h2>
                <PaymentSection
                  method={method}
                  onMethod={(m) => {
                    setMethod(m);
                    setPayError('');
                  }}
                  amount={totals.total}
                  orderRef={orderRef}
                  utr={utr}
                  onUtr={(v) => {
                    setUtr(v);
                    setErrors((prev) => ({ ...prev, utr: undefined }));
                  }}
                  utrError={errors.utr}
                  onlineEnabled={onlineEnabled}
                />
                {payError && (
                  <div className="alert alert-danger small mt-3 mb-0" role="alert">
                    {payError}
                  </div>
                )}
              </div>
            </Col>

            <Col lg={5}>
              <div className="osrjc-order-summary card border-0 shadow-sm p-4">
                <h2 className="h5 fw-bold mb-3">Order Summary</h2>
                <div className="osrjc-checkout-items mb-3">
                  {items.map((item) => (
                    <div key={item.id} className="d-flex justify-content-between align-items-center py-2 border-bottom small gap-2">
                      <span className="text-truncate">
                        {item.name} <span className="badge bg-secondary">x{item.quantity}</span>
                      </span>
                      <span className="fw-semibold text-nowrap">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Items</span>
                  <span>{totals.itemCount}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Subtotal</span>
                  <span>{formatCurrency(totals.subtotal)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Delivery charge</span>
                  <span className="text-success fw-semibold">{totals.deliveryFee === 0 ? 'FREE' : formatCurrency(totals.deliveryFee)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-3 fs-5 fw-bold">
                  <span>Total</span>
                  <span>{formatCurrency(totals.total)}</span>
                </div>
                <button type="submit" className="btn btn-osrjc-primary w-100 btn-lg" disabled={placing}>
                  {placing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Processing...
                    </>
                  ) : (
                    placeLabel
                  )}
                </button>
              </div>
            </Col>
          </Row>
        </form>
      </Container>

      <DemoPaymentModal
        show={demoOpen}
        amount={totals.total}
        method={method}
        onCancel={() => {
          setDemoOpen(false);
          setPlacing(false);
          showToast('Payment cancelled. Your cart is safe.', 'warning');
        }}
        onSuccess={(paymentId) => {
          setDemoOpen(false);
          finalize({ method, status: PAYMENT_STATUS.DEMO_PAID, paymentId, mode: 'demo' });
        }}
      />
    </>
  );
};

export default Checkout;
