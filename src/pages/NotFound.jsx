import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import PageMeta from '../components/PageMeta';

const NotFound = () => (
  <>
    <PageMeta title="Page Not Found" description="The page you are looking for does not exist." />
    <Container fluid="lg" className="py-5 text-center osrjc-notfound">
      <div className="osrjc-notfound-icon mb-3" aria-hidden="true">
        <i className="bi bi-cup-straw"></i>
      </div>
      <h1 className="display-3 fw-bold text-osrjc-orange">404</h1>
      <h2 className="h4 mb-3">Oops! This glass is empty.</h2>
      <p className="text-muted mb-4">The page you are looking for doesn&apos;t exist or has been moved.</p>
      <div className="d-flex justify-content-center gap-3 flex-wrap">
        <Link to="/" className="btn btn-osrjc-primary btn-lg">
          <i className="bi bi-house-door me-2" aria-hidden="true"></i>Back to Home
        </Link>
        <Link to="/menu" className="btn btn-osrjc-outline btn-lg">
          Browse Menu
        </Link>
      </div>
    </Container>
  </>
);

export default NotFound;
