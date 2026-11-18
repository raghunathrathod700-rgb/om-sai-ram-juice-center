import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import FormField from '../components/FormField';
import PageMeta from '../components/PageMeta';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { isValidEmail, isValidMobile } from '../utils/helpers';

const EMPTY = { fullName: '', mobile: '', email: '', password: '', confirmPassword: '', address: '' };

const Register = () => {
  const { register, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY);
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated && !submitting) return <Navigate to="/profile" replace />;

  const setField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = 'Full name is required.';
    if (!isValidMobile(form.mobile)) next.mobile = 'Enter a valid 10-digit mobile number.';
    if (!isValidEmail(form.email)) next.email = 'Enter a valid email address.';
    if (form.password.length < 6) next.password = 'Password must be at least 6 characters.';
    if (form.confirmPassword !== form.password) next.confirmPassword = 'Passwords do not match.';
    if (!form.address.trim()) next.address = 'Address is required.';
    if (!agree) next.agree = 'You must agree to the Terms & Conditions.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      await register(form);
      showToast('Account created successfully!', 'success');
      navigate('/profile', { replace: true });
    } catch (err) {
      setServerError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="osrjc-auth-page">
      <PageMeta title="Create Account" description="Create your Om Sai Ram Juice Center account to order online." />
      <Container fluid="lg" className="py-5">
        <Row className="justify-content-center">
          <Col md={9} lg={7}>
            <div className="osrjc-auth-card card border-0 shadow p-4 p-md-5">
              <div className="text-center mb-4">
                <i className="bi bi-person-plus-fill display-5 text-osrjc-orange" aria-hidden="true"></i>
                <h1 className="h3 fw-bold mt-2">Create Account</h1>
                <p className="text-muted small mb-0">Join us for fast, easy ordering</p>
              </div>

              {serverError && (
                <div className="alert alert-danger small" role="alert">
                  {serverError}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <Row className="g-3">
                  <Col md={6}>
                    <FormField id="reg-name" label="Full Name" value={form.fullName} onChange={setField('fullName')} error={errors.fullName} autoComplete="name" />
                  </Col>
                  <Col md={6}>
                    <FormField id="reg-mobile" label="Mobile Number" type="tel" inputMode="numeric" maxLength={10} value={form.mobile} onChange={setField('mobile')} error={errors.mobile} autoComplete="tel" />
                  </Col>
                  <Col xs={12}>
                    <FormField id="reg-email" label="Email" type="email" value={form.email} onChange={setField('email')} error={errors.email} autoComplete="email" />
                  </Col>
                  <Col md={6}>
                    <FormField id="reg-password" label="Password" type="password" value={form.password} onChange={setField('password')} error={errors.password} autoComplete="new-password" hint="At least 6 characters" />
                  </Col>
                  <Col md={6}>
                    <FormField id="reg-confirm" label="Confirm Password" type="password" value={form.confirmPassword} onChange={setField('confirmPassword')} error={errors.confirmPassword} autoComplete="new-password" />
                  </Col>
                  <Col xs={12}>
                    <FormField id="reg-address" label="Address" as="textarea" rows={2} value={form.address} onChange={setField('address')} error={errors.address} />
                  </Col>
                  <Col xs={12}>
                    <div className="form-check">
                      <input
                        id="agree"
                        type="checkbox"
                        className={`form-check-input ${errors.agree ? 'is-invalid' : ''}`}
                        checked={agree}
                        onChange={(e) => {
                          setAgree(e.target.checked);
                          setErrors((prev) => ({ ...prev, agree: undefined }));
                        }}
                      />
                      <label htmlFor="agree" className="form-check-label">
                        I agree to the Terms &amp; Conditions.
                      </label>
                      {errors.agree && <div className="invalid-feedback">{errors.agree}</div>}
                    </div>
                  </Col>
                </Row>
                <button type="submit" className="btn btn-osrjc-primary w-100 btn-lg mt-4" disabled={submitting}>
                  {submitting ? 'Creating Account...' : 'Register'}
                </button>
              </form>

              <p className="text-center small text-muted mt-4 mb-0">
                Already have an account? <Link to="/login" className="fw-semibold">Login</Link>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
