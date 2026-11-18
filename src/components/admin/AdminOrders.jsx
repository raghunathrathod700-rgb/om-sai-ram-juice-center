import { useCallback, useEffect, useState } from 'react';
import { Badge } from 'react-bootstrap';
import EmptyState from '../EmptyState';
import LoadingSpinner from '../LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import { listOrders, setOrderStatus, setPaymentStatus } from '../../services/adminService';
import {
  buildWhatsAppLink,
  formatCurrency,
  formatDate,
  FULFILMENT,
  getStatusFlow,
  orderStatusVariant,
  PAYMENT_STATUS,
  paymentMethodLabel,
  paymentStatusVariant,
} from '../../utils/helpers';

const FILTERS = ['', 'Order Placed', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Picked Up', 'Cancelled'];
const PAYMENT_OPTIONS = [PAYMENT_STATUS.PENDING_COD, PAYMENT_STATUS.AWAITING_VERIFICATION, PAYMENT_STATUS.AWAITING_PAYMENT, PAYMENT_STATUS.PAID];

const AdminOrders = () => {
  const { showToast } = useToast();
  const [filter, setFilter] = useState('');
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState('');

  const load = useCallback(async () => {
    try {
      setOrders(await listOrders(filter));
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }, [filter]);

  useEffect(() => {
    load();
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, [load]);

  const change = async (order, action) => {
    setBusyId(order.id);
    try {
      const updated = await action();
      setOrders((list) => list.map((o) => (o.id === updated.id ? updated : o)));
      showToast('Order updated.', 'success');
    } catch (err) {
      showToast(err.message, 'danger');
    } finally {
      setBusyId('');
    }
  };

  return (
    <>
      <div className="d-flex flex-wrap gap-2 align-items-end mb-3">
        <div>
          <label htmlFor="order-filter" className="form-label small mb-1">
            Show orders
          </label>
          <select id="order-filter" className="form-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
            {FILTERS.map((f) => (
              <option key={f || 'all'} value={f}>
                {f || 'All orders'}
              </option>
            ))}
          </select>
        </div>
        <button type="button" className="btn btn-osrjc-outline" onClick={load}>
          <i className="bi bi-arrow-clockwise me-1" aria-hidden="true"></i>Refresh
        </button>
        <span className="small text-muted ms-auto">Updates automatically every 30 seconds</span>
      </div>

      {error ? (
        <div className="alert alert-danger">{error}</div>
      ) : orders === null ? (
        <LoadingSpinner text="Loading orders..." />
      ) : orders.length === 0 ? (
        <EmptyState icon="bi-receipt" title="No orders found" text="New orders will appear here." />
      ) : (
        <div className="d-flex flex-column gap-3">
          {orders.map((o) => {
            const flow = [...getStatusFlow(o.fulfilment), 'Cancelled'];
            const busy = busyId === o.id;
            return (
              <article key={o.id} className="card border-0 shadow-sm p-3 p-md-4 osrjc-admin-order">
                <div className="d-flex flex-wrap justify-content-between gap-2 mb-2">
                  <div>
                    <h3 className="h6 mb-1">
                      #{o.id} <Badge bg={orderStatusVariant(o.status)}>{o.status}</Badge>{' '}
                      <Badge bg="light" text="dark" className="border">
                        {o.fulfilment === FULFILMENT.PICKUP ? 'Self Pickup' : 'Home Delivery'}
                      </Badge>
                    </h3>
                    <div className="small text-muted">{formatDate(o.createdAt)}</div>
                  </div>
                  <div className="text-md-end">
                    <div className="fs-5 fw-bold">{formatCurrency(o.total)}</div>
                    <div className="small text-muted">{paymentMethodLabel(o.payment.method)}</div>
                    <Badge bg={paymentStatusVariant(o.payment.status)}>{o.payment.status}</Badge>
                    {o.payment.paymentId && <div className="small text-muted text-break">Ref: {o.payment.paymentId}</div>}
                  </div>
                </div>

                <div className="row g-3 small">
                  <div className="col-md-5">
                    <strong>{o.deliveryInfo.fullName}</strong>
                    <div>
                      <a href={`tel:+91${o.deliveryInfo.mobile}`}>{o.deliveryInfo.mobile}</a>{' '}
                      <a href={buildWhatsAppLink(o.deliveryInfo.mobile, `Hello ${o.deliveryInfo.fullName}, about your order ${o.id}`)} target="_blank" rel="noopener noreferrer">
                        <i className="bi bi-whatsapp text-success" aria-label="WhatsApp"></i>
                      </a>
                    </div>
                    {o.customer?.email && <div className="text-muted">{o.customer.email}</div>}
                    <div className="mt-1 text-muted">
                      <i className="bi bi-geo-alt me-1" aria-hidden="true"></i>
                      {o.deliveryInfo.address}
                      {o.deliveryInfo.landmark ? `, ${o.deliveryInfo.landmark}` : ''}
                      {o.deliveryInfo.pincode ? ` – ${o.deliveryInfo.pincode}` : ''}
                    </div>
                  </div>
                  <div className="col-md-7">
                    <ul className="mb-0 osrjc-order-item-list">
                      {o.items.map((i) => (
                        <li key={i.id}>
                          {i.name} × {i.quantity} — {formatCurrency(i.price * i.quantity)}
                        </li>
                      ))}
                    </ul>
                    {o.deliveryFee > 0 && <div className="text-muted">Delivery fee: {formatCurrency(o.deliveryFee)}</div>}
                  </div>
                </div>

                <div className="row g-2 mt-2 pt-3 border-top">
                  <div className="col-sm-6">
                    <label htmlFor={`st-${o.id}`} className="form-label small mb-1">Order status</label>
                    <select
                      id={`st-${o.id}`}
                      className="form-select form-select-sm"
                      value={o.status}
                      disabled={busy}
                      onChange={(e) => change(o, () => setOrderStatus(o.id, e.target.value))}
                    >
                      {flow.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-sm-6">
                    <label htmlFor={`pay-${o.id}`} className="form-label small mb-1">Payment status</label>
                    <select
                      id={`pay-${o.id}`}
                      className="form-select form-select-sm"
                      value={o.payment.status}
                      disabled={busy}
                      onChange={(e) => change(o, () => setPaymentStatus(o.id, e.target.value))}
                    >
                      {PAYMENT_OPTIONS.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
};

export default AdminOrders;
