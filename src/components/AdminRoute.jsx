import { Link, Navigate, useLocation } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { USE_API } from '../config/shop';
import { useAuth } from '../context/AuthContext';
import EmptyState from './EmptyState';

/** Only the shop admin (and only when the backend is connected) can open /admin. */
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (!USE_API) {
    return (
      <Container fluid="lg" className="py-5">
        <div className="osrjc-empty text-center">
          <i className="bi bi-hdd-network display-4 text-muted d-block mb-3" aria-hidden="true"></i>
          <h1 className="h4">Admin panel needs the backend</h1>
          <p className="text-muted mb-1">
            Start the Spring Boot backend (see <code>backend/README.md</code>), then set <code>VITE_API_BASE_URL=http://localhost:8080</code> in the
            website&apos;s <code>.env</code> and restart <code>npm run dev</code>.
          </p>
          <Link to="/" className="btn btn-osrjc-primary mt-3">
            Back to Home
          </Link>
        </div>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location, message: 'Please login with the admin account.' }} replace />;
  }

  if (!isAdmin) {
    return (
      <Container fluid="lg" className="py-5">
        <EmptyState
          icon="bi-shield-lock"
          title="Admin only"
          text="This page is only for the shop admin."
          actionLabel="Back to Home"
          actionTo="/"
        />
      </Container>
    );
  }

  return children;
};

export default AdminRoute;
