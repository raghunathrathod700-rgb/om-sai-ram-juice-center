import { useCallback, useEffect, useState } from 'react';
import { Badge, Col, Row } from 'react-bootstrap';
import LoadingSpinner from '../LoadingSpinner';
import { getStats, listOrders } from '../../services/adminService';
import { formatCurrency, formatDate, orderStatusVariant } from '../../utils/helpers';

const Stat = ({ icon, label, value, tone = 'green', onClick }) => (
  <button type="button" className={`osrjc-admin-stat tone-${tone}`} onClick={onClick} disabled={!onClick}>
    <i className={`bi ${icon}`} aria-hidden="true"></i>
    <strong>{value}</strong>
    <span>{label}</span>
  </button>
);

const AdminDashboard = ({ onNavigate }) => {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const [s, orders] = await Promise.all([getStats(), listOrders()]);
      setStats(s);
      setRecent(orders.slice(0, 6));
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 30000); // new orders show up by themselves
    return () => clearInterval(id);
  }, [load]);

  if (error) {
    return (
      <div className="alert alert-danger d-flex justify-content-between align-items-center">
        <span>{error}</span>
        <button type="button" className="btn btn-sm btn-outline-danger" onClick={load}>
          Try again
        </button>
      </div>
    );
  }
  if (!stats) return <LoadingSpinner text="Loading dashboard..." />;

  return (
    <>
      <Row className="g-3 mb-4">
        <Col xs={6} md={4} xl={3}><Stat icon="bi-bag-check" label="Orders today" value={stats.ordersToday} onClick={() => onNavigate('orders')} /></Col>
        <Col xs={6} md={4} xl={3}><Stat icon="bi-currency-rupee" label="Sales today" value={formatCurrency(stats.salesToday)} tone="orange" /></Col>
        <Col xs={6} md={4} xl={3}><Stat icon="bi-hourglass-split" label="New / preparing" value={stats.pendingOrders} tone="orange" onClick={() => onNavigate('orders')} /></Col>
        <Col xs={6} md={4} xl={3}><Stat icon="bi-patch-question" label="Payments to verify" value={stats.awaitingVerification} tone="red" onClick={() => onNavigate('orders')} /></Col>
        <Col xs={6} md={4} xl={3}><Stat icon="bi-receipt" label="All orders" value={stats.totalOrders} /></Col>
        <Col xs={6} md={4} xl={3}><Stat icon="bi-cash-stack" label="Paid online/verified" value={formatCurrency(stats.totalPaid)} /></Col>
        <Col xs={6} md={4} xl={3}><Stat icon="bi-cup-straw" label="Menu items" value={stats.products} onClick={() => onNavigate('products')} /></Col>
      </Row>

      <div className="card border-0 shadow-sm p-3 p-md-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h2 className="h6 fw-bold mb-0">Latest orders</h2>
          <button type="button" className="btn btn-sm btn-osrjc-outline" onClick={() => onNavigate('orders')}>
            See all
          </button>
        </div>
        {recent.length === 0 ? (
          <p className="text-muted mb-0">No orders yet.</p>
        ) : (
          recent.map((o) => (
            <div key={o.id} className="d-flex flex-wrap justify-content-between align-items-center gap-2 py-2 border-top small">
              <span>
                <strong>#{o.id}</strong> · {o.customer?.name} · {formatDate(o.createdAt)}
              </span>
              <span className="d-flex align-items-center gap-2">
                <Badge bg={orderStatusVariant(o.status)}>{o.status}</Badge>
                <strong>{formatCurrency(o.total)}</strong>
              </span>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
