import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import FormField from '../components/FormField';
import PageMeta from '../components/PageMeta';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getRememberedIdentifier } from '../services/authService';

const Login = () => {
  const { login, isAuthenticated, isAdmin } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || (isAdmin ? '/admin' : '/profile');

  const [identifier, setIdentifier] = useState(() => getRememberedIdentifier() || '');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(() => !!getRememberedIdentifier());
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) return <Navigate to={redirectTo} replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setError('Please enter your email / mobile number and password.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await login({ identifier, password, rememberMe });
      showToast('Logged in successfully!', 'success');
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="osrjc-auth-page">
      <PageMeta title="Login" description="Login to your Om Sai Ram Juice Center account." />
      <Container fluid="lg" className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={5}>
            <div className="osrjc-auth-card card border-0 shadow p-4 p-md-5">
              <div className="text-center mb-4">
                <i className="bi bi-cup-straw display-5 text-osrjc-orange" aria-hidden="true"></i>
                <h1 className="h3 fw-bold mt-2">Welcome Back</h1>
                <p className="text-muted small mb-0">Login to order your favourite drinks &amp; desserts</p>
              </div>

              {location.state?.message && (
                <div className="alert alert-warning small" role="alert">
                  <i className="bi bi-info-circle me-1" aria-hidden="true"></i>
                  {location.state.message}
                </div>
              )}
              {error && (
                <div className="alert alert-danger small" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <FormField
                  id="login-id"
                  label="Email / Mobile Number"
                  className="mb-3"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  autoComplete="username"
                />
                <div className="mb-3">
                  <label htmlFor="login-password" className="form-label">
                    Password
                  </label>
                  <div className="osrjc-password-field">
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="osrjc-password-toggle"
                      onClick={() => setShowPassword((s) => !s)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} aria-hidden="true"></i>
                    </button>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check">
                    <input
                      id="remember"
                      type="checkbox"
                      className="form-check-input"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label htmlFor="remember" className="form-check-label">
                      Remember Me
                    </label>
                  </div>
                  <Link to="/forgot-password" className="small">
                    Forgot Password?
                  </Link>
                </div>

                <button type="submit" className="btn btn-osrjc-primary w-100 btn-lg" disabled={submitting}>
                  {submitting ? 'Logging in...' : 'Login'}
                </button>
              </form>

              <p className="text-center small text-muted mt-4 mb-0">
                Don&apos;t have an account? <Link to="/register" className="fw-semibold">Create Account</Link>
              </p>
              <p className="text-center small text-muted mt-3 mb-0">
                <i className="bi bi-shield-exclamation me-1" aria-hidden="true"></i>
                Demo login — accounts are stored only in this browser.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
