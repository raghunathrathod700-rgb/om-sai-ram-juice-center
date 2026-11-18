import { Col, Container, Row } from 'react-bootstrap';
import PageMeta from '../components/PageMeta';
import { SHOP_INFO } from '../config/shop';
import fruitLemon from '../assets/illustrations/fruit-lemon.svg';
import fruitOrange from '../assets/illustrations/fruit-orange.svg';
import fruitWatermelon from '../assets/illustrations/fruit-watermelon.svg';
import shopStorefront from '../assets/illustrations/shop-storefront.svg';

const VALUES = [
  { image: fruitLemon, icon: 'bi-droplet-half', title: 'Freshness First', text: 'Every drink is prepared fresh for you.' },
  { image: fruitOrange, icon: 'bi-hand-thumbs-up', title: 'Local & Trusted', text: 'Serving the local Sirpur community with freshness and taste.' },
  { image: fruitWatermelon, icon: 'bi-emoji-smile', title: 'Happy Customers', text: 'We aim to bring a smile with every glass we serve.' },
];

const About = () => (
  <>
    <PageMeta
      title="About Us"
      description="Learn about Om Sai Ram Juice Center, a local beverage and dessert destination in Sirpur, Burhanpur, Madhya Pradesh."
    />
    <div className="osrjc-page-header">
      <Container fluid="lg">
        <h1 className="h2 fw-bold mb-1">About Om Sai Ram Juice Center</h1>
        <p className="text-muted mb-0">Serving the local Sirpur community with freshness and taste</p>
      </Container>
    </div>

    <Container fluid="lg" className="py-5">
      <Row className="align-items-center g-5 mb-5">
        <Col lg={6}>
          <div className="osrjc-about-visual">
            <img src={shopStorefront} alt="Illustration of Om Sai Ram Juice Center storefront" loading="lazy" />
          </div>
        </Col>
        <Col lg={6}>
          <span className="osrjc-eyebrow">Our Story</span>
          <h2 className="mb-3">Freshness You Can Taste</h2>
          <p className="text-muted">
            Om Sai Ram Juice Center is a local beverage and dessert destination in Sirpur, Burhanpur, Madhya Pradesh.
            We serve fresh juices, refreshing drinks, lassi, badam shakes, faluda and a variety of ice creams.
          </p>
          <p className="text-muted mb-0">Serving the local Sirpur community with freshness and taste.</p>
        </Col>
      </Row>

      <Row className="g-4 mb-5">
        {VALUES.map((v) => (
          <Col key={v.title} md={4}>
            <div className="osrjc-feature-card h-100 text-center">
              <div className="osrjc-feature-icon">
                <img src={v.image} alt="" loading="lazy" />
                <span className="osrjc-feature-icon-badge">
                  <i className={`bi ${v.icon}`} aria-hidden="true"></i>
                </span>
              </div>
              <h3 className="h6 fw-bold mt-3">{v.title}</h3>
              <p className="small text-muted mb-0">{v.text}</p>
            </div>
          </Col>
        ))}
      </Row>

      <div className="osrjc-glass-card-light p-4 text-center">
        <i className="bi bi-geo-alt-fill text-osrjc-orange fs-3" aria-hidden="true"></i>
        <p className="fw-semibold mb-0 mt-2">{SHOP_INFO.addressLine}</p>
        <p className="text-muted small mb-0">
          Online delivery available only within {SHOP_INFO.deliveryRadiusMeters} meters of our shop.
        </p>
      </div>
    </Container>
  </>
);

export default About;
