import { SHOP_INFO } from '../config/shop';
import { describePaymentMode, getPaymentMode, PAYMENT_MODES } from '../services/paymentService';
import { buildUpiLink, formatCurrency, PAYMENT_METHODS } from '../utils/helpers';
import { getUpiQrImage } from '../utils/productPhotos';

const OPTIONS = [
  { id: PAYMENT_METHODS.COD, label: 'Cash on Delivery', hint: 'Pay when your order arrives / at pickup', icon: 'bi-cash-stack' },
  { id: PAYMENT_METHODS.UPI_QR, label: 'UPI / PhonePe QR', hint: 'Scan the shop QR — verified manually by the shop', icon: 'bi-qr-code-scan' },
  { id: PAYMENT_METHODS.ONLINE, label: 'Online Payment', hint: 'Card / UPI / Netbanking via Razorpay', icon: 'bi-credit-card-fill' },
];

/** Payment method picker + the details panel of the selected method. */
const PaymentSection = ({ method, onMethod, amount, orderRef, utr, onUtr, utrError, onlineEnabled = true }) => {
  const qr = getUpiQrImage();
  const mode = getPaymentMode();
  const upiLink = buildUpiLink({ amount, note: orderRef });

  return (
    <div>
      <div className="d-flex flex-column gap-2" role="radiogroup" aria-label="Payment method">
        {OPTIONS.map((opt) => (
          <label key={opt.id} className={`osrjc-payment-option ${method === opt.id ? 'active' : ''} ${opt.id === PAYMENT_METHODS.ONLINE && !onlineEnabled ? 'disabled' : ''}`}>
            <input
              type="radio"
              name="paymentMethod"
              value={opt.id}
              checked={method === opt.id}
              disabled={opt.id === PAYMENT_METHODS.ONLINE && !onlineEnabled}
              onChange={() => onMethod(opt.id)}
            />
            <i className={`bi ${opt.icon}`} aria-hidden="true"></i>
            <span>
              <strong className="d-block">{opt.label}</strong>
              <small className="text-muted">
                {opt.id === PAYMENT_METHODS.ONLINE && !onlineEnabled ? 'Not available right now' : opt.hint}
              </small>
            </span>
          </label>
        ))}
      </div>

      {method === PAYMENT_METHODS.UPI_QR && (
        <div className="osrjc-pay-panel mt-3">
          <div className="row g-3 align-items-center">
            <div className="col-sm-5 text-center">
              {qr ? (
                <img src={qr} alt="PhonePe UPI QR code of Om Sai Ram Juice Center" className="osrjc-qr-img" />
              ) : (
                <div className="osrjc-qr-placeholder">
                  <i className="bi bi-qr-code display-3" aria-hidden="true"></i>
                  <small>QR image not added yet</small>
                </div>
              )}
            </div>
            <div className="col-sm-7">
              <p className="mb-1">
                Pay <strong>{formatCurrency(amount)}</strong> to
              </p>
              <p className="fw-semibold mb-1">{SHOP_INFO.upiPayeeName}</p>
              {SHOP_INFO.upiId && (
                <p className="small mb-2">
                  UPI ID: <code>{SHOP_INFO.upiId}</code>
                </p>
              )}
              {upiLink && (
                <a href={upiLink} className="btn btn-sm btn-outline-secondary mb-2">
                  <i className="bi bi-phone me-1" aria-hidden="true"></i>Open UPI app
                </a>
              )}
              <label htmlFor="utr" className="form-label small fw-semibold mb-1">
                UPI transaction / UTR number
              </label>
              <input
                id="utr"
                className={`form-control ${utrError ? 'is-invalid' : ''}`}
                value={utr}
                onChange={(e) => onUtr(e.target.value)}
                placeholder="12-digit reference number"
                inputMode="numeric"
                maxLength={22}
              />
              {utrError && <div className="invalid-feedback">{utrError}</div>}
            </div>
          </div>
          <p className="small text-muted mt-3 mb-0">
            <i className="bi bi-info-circle me-1" aria-hidden="true"></i>
            After paying, enter the reference number and place the order. Your payment stays{' '}
            <strong>“Awaiting verification”</strong> until the shop checks it — it is never marked paid automatically.
          </p>
        </div>
      )}

      {method === PAYMENT_METHODS.ONLINE && (
        <div className="osrjc-pay-panel mt-3 small">
          <p className="mb-1">
            <i className="bi bi-shield-check me-1 text-success" aria-hidden="true"></i>
            {describePaymentMode(mode)}
          </p>
          {mode === PAYMENT_MODES.DEMO && (
            <p className="text-muted mb-0">Payment integration can be connected later using Razorpay/other payment gateway.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentSection;
