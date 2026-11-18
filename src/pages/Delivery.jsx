import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import DeliveryChecker from '../components/DeliveryChecker';
import PageMeta from '../components/PageMeta';
import { SHOP_INFO } from '../config/shop';
import { isGpsCheckEnabled } from '../services/deliveryService';

const STEPS = [
  { icon: 'bi-geo-alt', title: 'Enter Your Address', text: 'Tell us where you want your order delivered.' },
  { icon: 'bi-search', title: 'We Check Eligibility', text: `We confirm you are within our ${SHOP_INFO.deliveryRadiusMeters}-meter delivery zone.` },
  { icon: 'bi-bag-check', title: 'We Prepare Your Order', text: 'Your fresh order is prepared right away.' },
  { icon: 'bi-bicycle', title: 'Fast Local Delivery', text: 'It reaches you quickly, fresh and cold.' },
];

const Delivery = () => (
  <>
    <PageMeta
      title="Delivery Information"
      description="Om Sai Ram Juice Center offers online delivery only within 500 meters of our Sirpur shop. Check your delivery eligibility here."
    />
    <div className="osrjc-page-header">
      <Container fluid="lg">
        <h1 className="h2 fw-bold mb-1">Delivery Information</h1>
        <p className="text-muted mb-0">Everything you need to know about delivery from us</p>
      </Container>
    </div>

    <section className="osrjc-delivery-banner">
      <Container fluid="lg">
        <h2 className="h4 fw-bold mb-2 text-white d-flex align-items-start gap-2">
          <i className="bi bi-truck" aria-hidden="true"></i>
          <span>ONLINE DELIVERY IS AVAILABLE ONLY WITHIN {SHOP_INFO.deliveryRadiusMeters} METERS OF OM SAI RAM JUICE CENTER, SIRPUR.</span>
        </h2>
        <p className="mb-0 text-white fw-semibold">
          <span aria-hidden="true">📍</span> Sirpur, Burhanpur, Madhya Pradesh
        </p>
      </Container>
    </section>

    <Container fluid="lg" className="py-5">
      <Row className="g-5">
        <Col lg={6}>
          <h2 className="h4 fw-bold mb-3">Check Your Delivery Availability</h2>
          <p className="text-muted">
            {isGpsCheckEnabled()
              ? 'Type your address or use your phone location — we measure the real distance to our shop.'
              : 'Enter your address to see if you are inside our delivery zone. This website is currently in demo mode: the result is an estimate, not a real GPS distance.'}
          </p>
          <div className="card border-0 shadow-sm p-4">
            <DeliveryChecker />
          </div>
        </Col>

        <Col lg={6}>
          <h2 className="h4 fw-bold mb-3">How Delivery Works</h2>
          <ol className="list-unstyled d-flex flex-column gap-3 mb-0">
            {STEPS.map((s, i) => (
              <li key={s.title} className="d-flex gap-3 align-items-start">
                <span className="osrjc-step-number">{i + 1}</span>
                <div>
                  <h3 className="h6 fw-bold mb-1">
                    <i className={`bi ${s.icon} me-2 text-osrjc-orange`} aria-hidden="true"></i>
                    {s.title}
                  </h3>
                  <p className="small text-muted mb-0">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Col>
      </Row>

      <div className="osrjc-glass-card-light p-4 mt-5">
        <h3 className="h5 fw-bold mb-2">
          <i className="bi bi-info-circle me-2" aria-hidden="true"></i>Outside our delivery zone?
        </h3>
        <p className="text-muted mb-2">
          You can still order for <strong>Self Pickup</strong> at checkout and collect it from the shop, or simply visit
          us in Sirpur.
        </p>
        <Link to="/menu" className="btn btn-osrjc-primary btn-sm">
          Browse Menu
        </Link>
      </div>
    </Container>
  </>
);

export default Delivery;
