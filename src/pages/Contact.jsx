import { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import FormField from '../components/FormField';
import PageMeta from '../components/PageMeta';
import { SHOP_INFO } from '../config/shop';
import { OWNER_AVATARS } from '../data/siteContent';
import { useToast } from '../context/ToastContext';
import { buildWhatsAppLink } from '../utils/helpers';
import ShopMap from '../components/ShopMap';

const Contact = () => {
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', owner: '0', message: '' });
  const [errors, setErrors] = useState({});

  const setField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // No mail server: the message is sent through WhatsApp, which really reaches the shop.
  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = 'Please enter your name.';
    if (form.message.trim().length < 5) next.message = 'Please write your message.';
    setErrors(next);
    if (Object.keys(next).length) return;

    const owner = SHOP_INFO.owners[Number(form.owner)] || SHOP_INFO.owners[0];
    const text = `Hello ${owner.name}, I am ${form.name.trim()}.\n${form.message.trim()}`;
    window.open(buildWhatsAppLink(owner.phone, text), '_blank', 'noopener,noreferrer');
    showToast('Opening WhatsApp to send your message…', 'success', 'bi-whatsapp');
    setForm({ name: '', owner: form.owner, message: '' });
  };

  return (
    <>
      <PageMeta
        title="Contact Us"
        description="Contact Om Sai Ram Juice Center in Sirpur, Burhanpur — call or WhatsApp us directly."
      />
      <div className="osrjc-page-header">
        <Container fluid="lg">
          <h1 className="h2 fw-bold mb-1">Contact Us</h1>
          <p className="text-muted mb-0">We would love to hear from you</p>
        </Container>
      </div>

      <Container fluid="lg" className="py-5">
        <Row className="g-5">
          <Col lg={5}>
            <h2 className="h4 fw-bold mb-1">{SHOP_INFO.name}</h2>
            <p className="text-muted mb-4">
              <i className="bi bi-geo-alt-fill me-1" aria-hidden="true"></i>
              Sirpur, Burhanpur, Madhya Pradesh
            </p>

            <div className="d-flex flex-column gap-3">
              {SHOP_INFO.owners.map((owner, idx) => (
                <div key={owner.phone} className="osrjc-contact-person-card">
                  <div className="d-flex align-items-center gap-3">
                    <img src={OWNER_AVATARS[idx % OWNER_AVATARS.length]} alt="" className="osrjc-review-avatar osrjc-review-avatar-lg" loading="lazy" />
                    <div>
                      <div className="fw-bold">{owner.name}</div>
                      <div className="text-muted small">{owner.phone}</div>
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <a href={`tel:+91${owner.phone}`} className="btn btn-osrjc-primary btn-sm">
                      <i className="bi bi-telephone-fill me-1" aria-hidden="true"></i>Call Now
                    </a>
                    <a href={buildWhatsAppLink(owner.phone)} target="_blank" rel="noopener noreferrer" className="btn btn-success btn-sm">
                      <i className="bi bi-whatsapp me-1" aria-hidden="true"></i>WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {SHOP_INFO.openingHours && (
              <p className="mt-3 mb-0">
                <i className="bi bi-clock me-2 text-osrjc-orange" aria-hidden="true"></i>
                <strong>Opening hours:</strong> {SHOP_INFO.openingHours}
              </p>
            )}
            <div className="mt-4">
              <ShopMap />
            </div>
          </Col>

          <Col lg={7}>
            <div className="card border-0 shadow-sm p-4 p-md-5">
              <h2 className="h5 fw-bold mb-1">Send Us a Message</h2>
              <p className="text-muted small mb-4">Your message opens in WhatsApp so the shop receives it instantly.</p>
              <form onSubmit={handleSubmit} noValidate>
                <FormField id="ct-name" label="Your Name" className="mb-3" value={form.name} onChange={setField('name')} error={errors.name} />
                <FormField id="ct-owner" label="Send to" as="select" className="mb-3" value={form.owner} onChange={setField('owner')}>
                  {SHOP_INFO.owners.map((o, i) => (
                    <option key={o.phone} value={i}>
                      {o.name}
                    </option>
                  ))}
                </FormField>
                <FormField id="ct-message" label="Message" as="textarea" rows={4} className="mb-3" value={form.message} onChange={setField('message')} error={errors.message} />
                <button type="submit" className="btn btn-osrjc-primary">
                  <i className="bi bi-whatsapp me-2" aria-hidden="true"></i>Send via WhatsApp
                </button>
              </form>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Contact;
