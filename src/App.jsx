import { lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import AdminRoute from './components/AdminRoute';
import BackToTop from './components/BackToTop';
import CartDrawer from './components/CartDrawer';
import ErrorBoundary from './components/ErrorBoundary';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import MobileBottomNav from './components/MobileBottomNav';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

// Route-level code splitting: each page is downloaded only when it is opened.
const Home = lazy(() => import('./pages/Home'));
const Menu = lazy(() => import('./pages/Menu'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Profile = lazy(() => import('./pages/Profile'));
const Orders = lazy(() => import('./pages/Orders'));
const Admin = lazy(() => import('./pages/Admin'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Delivery = lazy(() => import('./pages/Delivery'));
const NotFound = lazy(() => import('./pages/NotFound'));

const App = () => {
  const location = useLocation();

  return (
    <div className="osrjc-app">
      <a href="#main-content" className="osrjc-skip-link">
        Skip to content
      </a>
      <ScrollToTop />
      <Navbar />
      <CartDrawer />

      <main id="main-content" className="osrjc-main">
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner fullPage />}>
            {/* key => the page-enter animation replays on every navigation */}
            <div key={location.pathname} className="osrjc-page-transition">
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/delivery" element={<Delivery />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </Suspense>
        </ErrorBoundary>
      </main>

      <Footer />
      <BackToTop />
      <MobileBottomNav />
    </div>
  );
};

export default App;
