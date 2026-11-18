import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import { SHOP_INFO } from '../config/shop';

const SOCIALS = Object.entries(SHOP_INFO.socials || {}).filter(([, url]) => url);

const Footer = () => {
  const year = Math.max(2026, new Date().getFullYear());
  return (
    <footer className="osrjc-footer">
      <Container fluid="lg" className="py-5">
        <Row className="g-4">
          <Col lg={4} md={6}>
            <div className="osrjc-brand mb-3">
              <span className="osrjc-brand-icon" aria-hidden="true">
                <i className="bi bi-cup-straw"></i>
              </span>
              <span className="osrjc-brand-text">
                <span className="line1">Om Sai Ram</span>
                <span className="line2">Juice Center</span>
              </span>
            </div>
            <p className="text-white-50 mb-2">
              <i className="bi bi-geo-alt-fill me-2" aria-hidden="true"></i>
              Sirpur, Burhanpur, Madhya Pradesh
            </p>
            {SHOP_INFO.openingHours && (
              <p className="text-white-50 mb-3">
                <i className="bi bi-clock me-2" aria-hidden="true"></i>
                {SHOP_INFO.openingHours}
              </p>
            )}
            {SOCIALS.length > 0 && (
              <div className="d-flex gap-2 mb-3" aria-label="Social media links">
                {SOCIALS.map(([key, url]) => (
                  <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="osrjc-social-btn" aria-label={key}>
                    <i className={`bi bi-${key}`} aria-hidden="true"></i>
                  </a>
                ))}
              </div>
            )}
            <div className="osrjc-footer-delivery-note">
              <i className="bi bi-truck me-2" aria-hidden="true"></i>
              Online delivery is available only within {SHOP_INFO.deliveryRadiusMeters} meters of Om Sai Ram Juice
              Center, Sirpur.
            </div>
          </Col>

          <Col lg={2} sm={6}>
            <h2 className="h6 text-uppercase fw-bold mb-3 text-white">Quick Links</h2>
            <ul className="list-unstyled osrjc-footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/menu">Menu</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/delivery">Delivery</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          </Col>

          <Col lg={3} sm={6}>
            <h2 className="h6 text-uppercase fw-bold mb-3 text-white">Services</h2>
            <ul className="list-unstyled osrjc-footer-links">
              <li><Link to="/menu?category=fresh-juices">Fresh Juices</Link></li>
              <li><Link to="/menu?category=traditional-drinks">Lassi</Link></li>
              <li><Link to="/menu?q=Badam">Badam Shake</Link></li>
              <li><Link to="/menu?category=faluda">Faluda</Link></li>
              <li><Link to="/menu?category=ice-cream">Ice Cream</Link></li>
              <li><Link to="/delivery">Local Delivery</Link></li>
            </ul>
          </Col>

          <Col lg={3} md={6}>
            <h2 className="h6 text-uppercase fw-bold mb-3 text-white">Contact</h2>
            <ul className="list-unstyled osrjc-footer-links">
              {SHOP_INFO.owners.map((owner) => (
                <li key={owner.phone} className="mb-2">
                  {owner.name}
                  <br />
                  <a href={`tel:+91${owner.phone}`} className="osrjc-footer-phone">
                    <i className="bi bi-telephone-fill me-1" aria-hidden="true"></i>
                    {owner.phone}
                  </a>
                </li>
              ))}
            </ul>
          </Col>
        </Row>

        <hr className="border-secondary opacity-25 my-4" />
        <div className="text-center text-white-50 small">
          &copy; {year} Om Sai Ram Juice Center. All Rights Reserved.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
