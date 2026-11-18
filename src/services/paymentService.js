/**
 * PAYMENT SERVICE — Razorpay (+ demo fallback)
 * ---------------------------------------------------------------------
 *  RAZORPAY_SERVER  (backend connected)   The Spring Boot server creates the Razorpay order and later
 *                   verifies the signature (the secure way). Keys live only on the server.
 *  RAZORPAY_CLIENT  (no backend, key in .env) real popup, NOT verified -> use TEST keys only.
 *  DEMO             (no backend, no key)      simulated payment window, no money moves.
 * ---------------------------------------------------------------------
 */
import { PAYMENT_ENV, SHOP_INFO, USE_API } from '../config/shop';
import { http } from './http';

export const PAYMENT_MODES = {
  DEMO: 'demo',
  RAZORPAY_CLIENT: 'razorpay-client',
  RAZORPAY_SERVER: 'razorpay-server',
};

export const getPaymentMode = () => {
  if (USE_API) return PAYMENT_MODES.RAZORPAY_SERVER;
  return PAYMENT_ENV.razorpayKeyId ? PAYMENT_MODES.RAZORPAY_CLIENT : PAYMENT_MODES.DEMO;
};

export const describePaymentMode = (mode) =>
  ({
    [PAYMENT_MODES.DEMO]: 'Demo mode — no real money is charged. Connect the backend (or add a Razorpay key) to go live.',
    [PAYMENT_MODES.RAZORPAY_CLIENT]:
      'Razorpay (client-only). Payments are not server-verified — use TEST keys, or connect the backend.',
    [PAYMENT_MODES.RAZORPAY_SERVER]: 'Razorpay secure mode — payments are verified by the shop server.',
  })[mode];

/** Is the "Online Payment" option usable? (backend mode asks the server) */
export const getOnlineConfig = async () => {
  if (!USE_API) return { enabled: true };
  try {
    return await http.get('/api/payments/config');
  } catch {
    return { enabled: false };
  }
};

export class PaymentCancelledError extends Error {
  constructor() {
    super('Payment cancelled.');
    this.name = 'PaymentCancelledError';
    this.cancelled = true;
  }
}

const CHECKOUT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';
let scriptPromise = null;

export const loadRazorpayScript = () => {
  if (globalThis.Razorpay) return Promise.resolve(true);
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = CHECKOUT_SRC;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      scriptPromise = null;
      resolve(false);
    };
    document.body.appendChild(script);
  });
  return scriptPromise;
};

const openCheckout = (options) =>
  new Promise((resolve, reject) => {
    let settled = false;
    const settle = (fn, value) => {
      if (!settled) {
        settled = true;
        fn(value);
      }
    };
    const rzp = new globalThis.Razorpay({
      ...options,
      handler: (response) => settle(resolve, response),
      modal: { ondismiss: () => settle(reject, new PaymentCancelledError()) },
    });
    rzp.on('payment.failed', (res) =>
      settle(reject, new Error(res?.error?.description || 'Payment failed. Please try again.'))
    );
    rzp.open();
  });

const baseOptions = (customer, description) => ({
  currency: 'INR',
  name: SHOP_INFO.name,
  description,
  prefill: { name: customer.name, contact: customer.mobile, email: customer.email },
  theme: { color: '#FF9800' },
});

/**
 * BACKEND MODE — opens the popup for an order the server already created.
 * info = { keyId, orderId, amount(paise) } from the API. Resolves with Razorpay's
 * { razorpay_order_id, razorpay_payment_id, razorpay_signature } (send it to /api/payments/verify).
 */
export const payServerOrder = async (info, customer, description) => {
  const loaded = await loadRazorpayScript();
  if (!loaded) throw new Error('Could not load the payment window. Check your internet connection.');
  return openCheckout({
    ...baseOptions(customer, description),
    key: info.keyId,
    amount: info.amount,
    order_id: info.orderId,
  });
};

/** LOCAL MODE (no backend) — client-only Razorpay popup. Resolves { mode, paymentId, verified:false }. */
export const payWithRazorpay = async ({ amount, receiptId, customer, description, preferredMethod }) => {
  if (getPaymentMode() !== PAYMENT_MODES.RAZORPAY_CLIENT) throw new Error('Razorpay is not configured.');
  if (!(amount >= 1)) throw new Error('Invalid payment amount.');
  const loaded = await loadRazorpayScript();
  if (!loaded) throw new Error('Could not load the payment window. Check your internet connection.');
  const base = baseOptions(customer, description);
  const response = await openCheckout({
    ...base,
    key: PAYMENT_ENV.razorpayKeyId,
    amount: Math.round(amount * 100),
    prefill: { ...base.prefill, ...(preferredMethod ? { method: preferredMethod } : {}) },
    notes: { receipt: receiptId },
  });
  return { mode: PAYMENT_MODES.RAZORPAY_CLIENT, paymentId: response.razorpay_payment_id, verified: false };
};
