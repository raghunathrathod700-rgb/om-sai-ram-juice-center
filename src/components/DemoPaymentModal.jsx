import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { formatCurrency, paymentMethodLabel } from '../utils/helpers';

/**
 * DEMO payment window (used only while no Razorpay key is configured).
 * It looks like a gateway but NO money moves and nothing is charged.
 */
const DemoPaymentModal = ({ show, amount, method, onSuccess, onCancel }) => {
  const [processing, setProcessing] = useState(false);

  const pay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onSuccess(`demo_${Date.now().toString(36)}`);
    }, 1200);
  };

  return (
    <Modal show={show} onHide={processing ? undefined : onCancel} centered backdrop="static" aria-labelledby="demo-pay-title">
      <Modal.Header closeButton={!processing}>
        <Modal.Title id="demo-pay-title" className="h5">
          <i className="bi bi-shield-lock me-2" aria-hidden="true"></i>Demo Payment
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <p className="text-muted small mb-1">{paymentMethodLabel(method)}</p>
        <div className="display-6 fw-bold mb-3">{formatCurrency(amount)}</div>
        <div className="alert alert-info small text-start mb-0">
          This is a <strong>demo screen</strong> — no real payment is made. Add your Razorpay key in <code>.env</code>
          to open the real payment window.
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button type="button" className="btn btn-outline-secondary" onClick={onCancel} disabled={processing}>
          Cancel
        </button>
        <button type="button" className="btn btn-osrjc-primary" onClick={pay} disabled={processing}>
          {processing ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Processing...
            </>
          ) : (
            <>Pay {formatCurrency(amount)} (demo)</>
          )}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default DemoPaymentModal;
