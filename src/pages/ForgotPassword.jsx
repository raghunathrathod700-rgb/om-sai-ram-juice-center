import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import FormField from '../components/FormField';
import PageMeta from '../components/PageMeta';
import { useToast } from '../context/ToastContext';
import { SHOP_INFO } from '../config/shop';
import { accountExists, passwordResetAvailable, resetPassword } from '../services/authService';

/** DEMO reset: there is no email/SMS server, so the new password is set right here. */
const ForgotPassword = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const findAccount = (e) => {
    e.preventDefault();
    if (!accountExists(identifier)) {
      setError('No account found with this email / mobile number.');
      return;
    }
    setError('');
    setStep(2);
  };

  const saveNewPassword = async (e) => {
    e.preventDefault();
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    if (password !== confirm) return setError('Passwords do not match.');
    setBusy(true);
    try {
      await resetPassword({ identifier, newPassword: password });
      showToast('Password updated. Please login.', 'success');
      navigate('/login', { replace: true });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
    return undefined;
  };

  if (!passwordResetAvailable) {
    return (
      <div className="osrjc-auth-page">
        <PageMeta title="Forgot Password" description="Reset your Om Sai Ram Juice Center password." />
        <Container fluid="lg" className="py-5">
          <Row className="justify-content-center">
            <Col md={8} lg={5}>
              <div className="osrjc-auth-card card border-0 shadow p-4 p-md-5 text-center">
                <i className="bi bi-key display-5 text-osrjc-orange" aria-hidden="true"></i>
                <h1 className="h3 fw-bold mt-2">Forgot Password</h1>
                <p className="text-muted">
                  For your safety the shop resets passwords personally. Please call us and we will help you right away.
                </p>
                {SHOP_INFO.owners.slice(0, 1).map((o) => (
                  <a key={o.phone} href={`tel:+91${o.phone}`} className="btn btn-osrjc-primary mb-2">
                    <i className="bi bi-telephone-fill me-1" aria-hidden="true"></i>Call {o.name}
                  </a>
                ))}
                <Link to="/login">Back to Login</Link>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div className="osrjc-auth-page">
      <PageMeta title="Forgot Password" description="Reset your Om Sai Ram Juice Center password." />
      <Container fluid="lg" className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={5}>
            <div className="osrjc-auth-card card border-0 shadow p-4 p-md-5">
              <div className="text-center mb-4">
                <i className="bi bi-key display-5 text-osrjc-orange" aria-hidden="true"></i>
                <h1 className="h3 fw-bold mt-2">Forgot Password</h1>
              </div>
              <div className="alert alert-info small">
                Demo mode: no email/SMS is sent. In the real version a verified OTP / email link will be used.
              </div>
              {error && (
                <div className="alert alert-danger small" role="alert">
                  {error}
                </div>
              )}

              {step === 1 ? (
                <form onSubmit={findAccount} noValidate>
                  <FormField id="fp-id" label="Email / Mobile Number" className="mb-3" value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
                  <button type="submit" className="btn btn-osrjc-primary w-100">Continue</button>
                </form>
              ) : (
                <form onSubmit={saveNewPassword} noValidate>
                  <FormField id="fp-new" label="New Password" type="password" className="mb-3" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
                  <FormField id="fp-confirm" label="Confirm New Password" type="password" className="mb-3" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
                  <button type="submit" className="btn btn-osrjc-primary w-100" disabled={busy}>
                    {busy ? 'Saving...' : 'Save New Password'}
                  </button>
                </form>
              )}

              <p className="text-center small mt-4 mb-0">
                <Link to="/login">Back to Login</Link>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ForgotPassword;
