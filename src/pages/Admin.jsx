import { useState } from 'react';
import { Container } from 'react-bootstrap';
import AdminCategories from '../components/admin/AdminCategories';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminOrders from '../components/admin/AdminOrders';
import AdminProducts from '../components/admin/AdminProducts';
import PageMeta from '../components/PageMeta';
import { useAuth } from '../context/AuthContext';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
  { id: 'orders', label: 'Orders', icon: 'bi-receipt' },
  { id: 'products', label: 'Menu & Prices', icon: 'bi-cup-straw' },
  { id: 'categories', label: 'Categories', icon: 'bi-tags' },
];

const Admin = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('dashboard');

  return (
    <>
      <PageMeta title="Admin Panel" description="Manage the Om Sai Ram Juice Center menu, prices and orders." />
      <div className="osrjc-page-header">
        <Container fluid="lg">
          <h1 className="h2 fw-bold mb-1">Admin Panel</h1>
          <p className="text-muted mb-0">Logged in as {user?.fullName}. Changes show on the website immediately.</p>
        </Container>
      </div>

      <Container fluid="lg" className="py-4">
        <div className="osrjc-admin-tabs" role="tablist" aria-label="Admin sections">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              className={tab === t.id ? 'active' : ''}
              onClick={() => setTab(t.id)}
            >
              <i className={`bi ${t.icon}`} aria-hidden="true"></i>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {tab === 'dashboard' && <AdminDashboard onNavigate={setTab} />}
        {tab === 'orders' && <AdminOrders />}
        {tab === 'products' && <AdminProducts />}
        {tab === 'categories' && <AdminCategories />}
      </Container>
    </>
  );
};

export default Admin;
