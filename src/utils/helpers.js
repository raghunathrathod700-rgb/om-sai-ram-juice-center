import { SHOP_INFO } from '../config/shop';

/* ------------------------------ formatting ------------------------------ */
/** ₹20 for whole rupees, ₹22.50 when the shop sets a price with paise. */
export const formatCurrency = (amount) => {
  const n = Number(amount || 0);
  return `₹${Number.isInteger(n) ? n.toFixed(0) : n.toFixed(2)}`;
};

export const formatDate = (isoString) =>
  new Date(isoString).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export const generateId = (prefix = 'ID') =>
  `${prefix}-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 900 + 100)}`;

/* ------------------------------ validation ------------------------------ */
export const isValidMobile = (mobile = '') => /^[6-9]\d{9}$/.test(mobile.trim());
export const isValidEmail = (email = '') => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
export const isValidPincode = (pin = '') => /^\d{6}$/.test(pin.trim());

/* ------------------------------ order flow ------------------------------ */
export const FULFILMENT = { DELIVERY: 'delivery', PICKUP: 'pickup' };

export const STATUS_FLOW = {
  delivery: ['Order Placed', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered'],
  pickup: ['Order Placed', 'Preparing', 'Ready', 'Picked Up'],
};
export const getStatusFlow = (fulfilment) => STATUS_FLOW[fulfilment] || STATUS_FLOW.delivery;

export const orderStatusVariant = (status) =>
  ({
    'Order Placed': 'secondary',
    Preparing: 'warning',
    Ready: 'info',
    'Out for Delivery': 'primary',
    Delivered: 'success',
    'Picked Up': 'success',
    Cancelled: 'danger',
  })[status] || 'secondary';

/* ------------------------------ payments -------------------------------- */
export const PAYMENT_METHODS = {
  COD: 'cod',
  UPI_QR: 'upi',
  ONLINE: 'online',
};

export const PAYMENT_STATUS = {
  PENDING_COD: 'Pay on delivery',
  AWAITING_VERIFICATION: 'Awaiting verification',
  AWAITING_PAYMENT: 'Awaiting payment',
  PAID: 'Paid',
  DEMO_PAID: 'Demo payment',
};

export const paymentMethodLabel = (method) =>
  ({ cod: 'Cash on Delivery', upi: 'UPI / PhonePe QR', online: 'Online Payment' })[method] || method;

export const paymentStatusVariant = (status) =>
  ({
    [PAYMENT_STATUS.PAID]: 'success',
    [PAYMENT_STATUS.DEMO_PAID]: 'info',
    [PAYMENT_STATUS.AWAITING_VERIFICATION]: 'warning',
    [PAYMENT_STATUS.AWAITING_PAYMENT]: 'danger',
    [PAYMENT_STATUS.PENDING_COD]: 'secondary',
  })[status] || 'secondary';

/** Subtotal / delivery fee / total for a list of cart lines. */
export const computeTotals = (items, fulfilment = FULFILMENT.DELIVERY) => {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const deliveryFee = fulfilment === FULFILMENT.DELIVERY && subtotal > 0 ? SHOP_INFO.deliveryFee : 0;
  return { subtotal, itemCount, deliveryFee, total: subtotal + deliveryFee };
};

/** UPI deep link — opens PhonePe / GPay / Paytm on a phone. Needs SHOP_INFO.upiId. */
export const buildUpiLink = ({ amount, note }) => {
  if (!SHOP_INFO.upiId) return '';
  const params = new URLSearchParams({
    pa: SHOP_INFO.upiId,
    pn: SHOP_INFO.upiPayeeName,
    am: String(Number(amount).toFixed(2)),
    cu: 'INR',
    tn: note || 'Order payment',
  });
  return `upi://pay?${params.toString()}`;
};

export const buildWhatsAppLink = (phone, text = '') =>
  `https://wa.me/91${phone}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

/* ------------------------------ geo ------------------------------------- */
/** Great-circle distance in metres between two lat/lng points (Haversine). */
export const haversineMeters = (a, b) => {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};
