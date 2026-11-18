import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    const message =
      location.pathname === '/checkout'
        ? 'Please login to continue with your order.'
        : 'Please login to view this page.';
    return <Navigate to="/login" state={{ from: location, message }} replace />;
  }
  return children;
};

export default ProtectedRoute;
