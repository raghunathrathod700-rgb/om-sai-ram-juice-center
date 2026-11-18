import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import FormField from '../components/FormField';
import PageMeta from '../components/PageMeta';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useFavourites } from '../context/FavouritesContext';
import { useToast } from '../context/ToastContext';
import { getOrdersForUser } from '../services/orderService';
import { isValidEmail, isValidMobile } from '../utils/helpers';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const { itemCount } = useCart();
  const { favouriteCount } = useFavourites();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    fullName: user.fullName,
    email: user.email,
    mobile: user.mobile,
    address: user.address || '',
  });
  const [errors, setErrors] = useState({});
  const [saveError, setSaveError] = useState('');
  const [orderCount, setOrderCount] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    getOrdersForUser(user.id)
      .then((list) => active && setOrderCount(list.length))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [user.id]);

  const setField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const startEdit = () => {
    setForm({ fullName: user.fullName, email: user.email, mobile: user.mobile, address: user.address || '' });
    setErrors({});
    setSaveError('');
    setEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const next = {};
    if (!form.fullName.trim()) next.fullName = 'Name is required.';
    if (!isValidEmail(form.email)) next.email = 'Enter a valid email.';
    if (!isValidMobile(form.mobile)) next.mobile = 'Enter a valid 10-digit mobile number.';
    if (!form.address.trim()) next.address = 'Address is required.';
    setErrors(next);
    if (Object.keys(next).length) return;
    setSaving(true);
    setSaveError('');
    try {
      await updateUser(form);
      setEditing(false);
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully.', 'secondary');
    navigate('/');
  };

  const stats = [
    { label: 'My Orders', value: orderCount, icon: 'bi-receipt', to: '/orders' },
    { label: 'Favourites', value: favouriteCount, icon: 'bi-heart-fill', to: '/menu?fav=1' },
    { label: 'In Cart', value: itemCount, icon: 'bi-cart3', to: '/cart' },
  ];

  return (
    <>
      <PageMeta title="My Profile" description="Manage your Om Sai Ram Juice Center account details." />
      <Container fluid="lg" className="py-4">
        <h1 className="h2 fw-bold mb-4">My Profile</h1>

        <Row className="g-4">
          <Col lg={4}>
            <div className="card border-0 shadow-sm text-center p-4 osrjc-profile-card">
              <div className="osrjc-profile-avatar mx-auto mb-3" aria-hidden="true">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
              <h2 className="h5 fw-bold mb-1">{user.fullName}</h2>
              <p className="text-muted small mb-3">{user.email}</p>
              <div className="d-grid gap-2">
                <Link to="/orders" className="btn btn-osrjc-outline">
                  <i className="bi bi-receipt me-2" aria-hidden="true"></i>My Orders
                </Link>
                <button type="button" className="btn btn-outline-danger" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2" aria-hidden="true"></i>Logout
                </button>
              </div>
            </div>
          </Col>

          <Col lg={8}>
            <Row className="g-3 mb-4">
              {stats.map((s) => (
                <Col key={s.label} xs={4}>
                  <Link to={s.to} className="osrjc-stat-card text-decoration-none">
                    <i className={`bi ${s.icon}`} aria-hidden="true"></i>
                    <strong>{s.value}</strong>
                    <span>{s.label}</span>
                  </Link>
                </Col>
              ))}
            </Row>

            <div className="card border-0 shadow-sm p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h5 fw-bold mb-0">Account Details</h2>
                {!editing && (
                  <button type="button" className="btn btn-sm btn-osrjc-outline" onClick={startEdit}>
                    <i className="bi bi-pencil-square me-1" aria-hidden="true"></i>Edit Profile
                  </button>
                )}
              </div>

              {editing ? (
                <form onSubmit={handleSave} noValidate>
                  {saveError && (
                    <div className="alert alert-danger small" role="alert">
                      {saveError}
                    </div>
                  )}
                  <Row className="g-3">
                    <Col md={6}>
                      <FormField id="pf-name" label="Full Name" value={form.fullName} onChange={setField('fullName')} error={errors.fullName} />
                    </Col>
                    <Col md={6}>
                      <FormField id="pf-mobile" label="Mobile Number" type="tel" inputMode="numeric" maxLength={10} value={form.mobile} onChange={setField('mobile')} error={errors.mobile} />
                    </Col>
                    <Col xs={12}>
                      <FormField id="pf-email" label="Email" type="email" value={form.email} onChange={setField('email')} error={errors.email} />
                    </Col>
                    <Col xs={12}>
                      <FormField id="pf-address" label="Address" as="textarea" rows={2} value={form.address} onChange={setField('address')} error={errors.address} />
                    </Col>
                  </Row>
                  <div className="d-flex gap-2 mt-4">
                    <button type="submit" className="btn btn-osrjc-primary" disabled={saving}>
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setEditing(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <dl className="row mb-0">
                  <dt className="col-sm-4 text-muted fw-normal">Name</dt>
                  <dd className="col-sm-8">{user.fullName}</dd>
                  <dt className="col-sm-4 text-muted fw-normal">Email</dt>
                  <dd className="col-sm-8">{user.email}</dd>
                  <dt className="col-sm-4 text-muted fw-normal">Mobile</dt>
                  <dd className="col-sm-8">{user.mobile}</dd>
                  <dt className="col-sm-4 text-muted fw-normal">Address</dt>
                  <dd className="col-sm-8 mb-0">{user.address}</dd>
                </dl>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Profile;
