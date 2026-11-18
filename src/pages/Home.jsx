import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Card, Col, Container, Row } from 'react-bootstrap';
import DeliveryChecker from '../components/DeliveryChecker';
import LoadingSpinner from '../components/LoadingSpinner';
import BannerSlider from '../components/BannerSlider';
import CatalogError from '../components/CatalogError';
import HeroGallery from '../components/HeroGallery';
import PageMeta from '../components/PageMeta';
import PhotoGallery from '../components/PhotoGallery';
import ShopMap from '../components/ShopMap';
import ProductCard from '../components/ProductCard';
import Reveal from '../components/Reveal';
import { SHOP_INFO } from '../config/shop';
import { BANNERS, FEATURED_NAMES, FEATURES, FLOATING_FRUITS, GALLERY, HERO_SLIDES, OFFERS, REVIEWS } from '../data/siteContent';
import { ICE_CREAM_BRANDS } from '../data/products';
import { useProducts } from '../hooks/useProducts';
import { buildWhatsAppLink, formatCurrency } from '../utils/helpers';
import { getShopPhoto } from '../utils/productPhotos';
import shopStorefront from '../assets/illustrations/shop-storefront.svg';

const SectionHeading = ({ eyebrow, title, note, align = 'center' }) => (
  <div className={`osrjc-section-heading ${align === 'start' ? 'text-start' : ''}`}>
    <span className="osrjc-eyebrow">{eyebrow}</span>
    <h2>{title}</h2>
    {note && <p className="text-muted small mb-0">{note}</p>}
  </div>
);

const ProductGrid = ({ list }) => (
  <Row className="g-3 g-md-4">
    {list.map((p, i) => (
      <Col key={p.id} xs={6} md={4} lg={3}>
        <Reveal delay={i * 60} className="h-100">
          <ProductCard product={p} />
        </Reveal>
      </Col>
    ))}
  </Row>
);

const Home = () => {
  const { products, loading, error } = useProducts();
  const [brand, setBrand] = useState('all');
  const shopPhoto = useMemo(() => getShopPhoto(), []);

  // backend: products ticked "Featured" in the admin panel; local demo: FEATURED_NAMES
  const popular = useMemo(() => {
    const flagged = products.filter((p) => p.featured);
    const list = flagged.length
      ? flagged
      : FEATURED_NAMES.map((n) => products.find((p) => p.name.toLowerCase() === n.toLowerCase())).filter(Boolean);
    return list.slice(0, 4);
  }, [products]);
  const juices = useMemo(() => products.filter((p) => p.category === 'fresh-juices').slice(0, 4), [products]);
  const allIceCreams = useMemo(() => products.filter((p) => p.category === 'ice-cream'), [products]);
  const iceCreams = useMemo(
    () => allIceCreams.filter((p) => brand === 'all' || p.brand === brand).slice(0, 8),
    [allIceCreams, brand]
  );
  const offerLink = (offer) => {
    const product = products.find((p) => p.name.toLowerCase() === offer.cta.productName.toLowerCase());
    return product ? `/product/${product.id}` : offer.cta.fallback;
  };

  // promo line is built from the REAL prices in products.js
  const cheapestJuice = useMemo(() => {
    const prices = products.filter((p) => p.category === 'fresh-juices').map((p) => p.price);
    return prices.length ? Math.min(...prices) : null;
  }, [products]);

  return (
    <>
      <PageMeta
        title="Fresh Juice, Lassi, Faluda & Ice Cream in Sirpur, Burhanpur"
        description="Om Sai Ram Juice Center in Sirpur, Burhanpur offers fresh juices, lassi, badam shake, faluda and ice creams. Local delivery available within 500 meters."
      />

      {/* ---------------- HERO ---------------- */}
      <section className="osrjc-hero">
        <div className="osrjc-floating-fruits" aria-hidden="true">
          {FLOATING_FRUITS.map((f) => (
            <img key={f.className} src={f.image} alt="" className={`osrjc-fruit ${f.className}`} loading="lazy" />
          ))}
        </div>
        <Container fluid="lg" className="position-relative">
          <Row className="align-items-center g-4 g-lg-5">
            <Col lg={6} className="osrjc-fade-up order-2 order-lg-1">
              <Badge className="osrjc-hero-badge mb-3">
                <i className="bi bi-geo-alt-fill me-1" aria-hidden="true"></i> Sirpur, Burhanpur, MP
              </Badge>
              <h1 className="osrjc-hero-title">Freshness in Every Sip!</h1>
              <p className="osrjc-hero-subtitle">Enjoy Fresh, Delicious &amp; Natural Juices Made With Love.</p>
              <p className="osrjc-hero-promo">
                <i className="bi bi-lightning-charge-fill" aria-hidden="true"></i>
                {cheapestJuice ? `Fresh juices from just ${formatCurrency(cheapestJuice)}` : 'Fresh juices, lassi, faluda & ice creams'} · Delivery
                within {SHOP_INFO.deliveryRadiusMeters} meters
              </p>
              <div className="d-flex flex-wrap gap-3 mt-4">
                <Link to="/menu?category=fresh-juices" className="btn btn-osrjc-primary btn-lg">
                  Order Now <i className="bi bi-arrow-right ms-1" aria-hidden="true"></i>
                </Link>
                <Link to="/menu" className="btn btn-osrjc-outline btn-lg">
                  Explore Menu
                </Link>
              </div>
              <ul className="osrjc-hero-points list-unstyled">
                <li><i className="bi bi-check-circle-fill" aria-hidden="true"></i> Fresh fruits</li>
                <li><i className="bi bi-check-circle-fill" aria-hidden="true"></i> Hygienic</li>
                <li><i className="bi bi-check-circle-fill" aria-hidden="true"></i> Fast service</li>
              </ul>
            </Col>
            <Col lg={6} className="osrjc-fade-up osrjc-fade-up-delay order-1 order-lg-2">
              <div className="osrjc-hero-visual">
                <HeroGallery slides={HERO_SLIDES} />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ---------------- DELIVERY BANNER ---------------- */}
      <section className="osrjc-delivery-banner" aria-labelledby="delivery-banner-title">
        <Container fluid="lg">
          <Row className="align-items-center g-4">
            <Col md={7}>
              <h2 id="delivery-banner-title" className="h4 fw-bold mb-2 text-white d-flex align-items-start gap-2">
                <i className="bi bi-truck" aria-hidden="true"></i>
                <span>FREE/LOCAL DELIVERY AVAILABLE WITHIN {SHOP_INFO.deliveryRadiusMeters} METERS</span>
              </h2>
              <p className="mb-2 text-white-50">
                Online delivery is available only within {SHOP_INFO.deliveryRadiusMeters} meters from Om Sai Ram Juice
                Center, Sirpur.
              </p>
              <p className="mb-0 text-white fw-semibold">
                <span aria-hidden="true">📍</span> Sirpur, Burhanpur, Madhya Pradesh
              </p>
            </Col>
            <Col md={5}>
              <div className="osrjc-glass-card p-3">
                <DeliveryChecker />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {loading ? (
        <LoadingSpinner text="Preparing our fresh menu..." />
      ) : error && products.length === 0 ? (
        <Container fluid="lg" className="py-5">
          <CatalogError error={error} />
        </Container>
      ) : (
        <>
          <section className="py-5">
            <Container fluid="lg">
              <SectionHeading eyebrow="Customer Favourites" title="Popular Products" />
              <ProductGrid list={popular} />
            </Container>
          </section>

          <section className="py-5 osrjc-section-tint">
            <Container fluid="lg">
              <SectionHeading eyebrow="Squeezed Fresh" title="Fresh Juices" />
              <ProductGrid list={juices} />
              <div className="text-center mt-4">
                <Link to="/menu?category=fresh-juices" className="btn btn-osrjc-outline">
                  View All Fresh Juices
                </Link>
              </div>
            </Container>
          </section>

          <section className="py-4 osrjc-section-tint" aria-label="Ice cream offers">
            <Container fluid="lg">
              <BannerSlider slides={BANNERS} />
            </Container>
          </section>

          <section className="py-5" id="ice-cream">
            <Container fluid="lg">
              <SectionHeading eyebrow="Premium Scoops" title="Ice Cream Brands" />
              <div className="osrjc-brand-filter justify-content-center mb-4" role="group" aria-label="Filter ice cream by brand">
                {['all', ...ICE_CREAM_BRANDS].map((b) => (
                  <button
                    key={b}
                    type="button"
                    aria-pressed={brand === b}
                    className={`osrjc-brand-pill ${brand === b ? 'active' : ''}`}
                    onClick={() => setBrand(b)}
                  >
                    {b === 'all' ? 'All brands' : b}
                  </button>
                ))}
              </div>
              {iceCreams.length === 0 ? (
                <p className="text-center text-muted">No ice creams found for this brand.</p>
              ) : (
                <div key={brand} className="osrjc-fade-up">
                  <ProductGrid list={iceCreams} />
                </div>
              )}
              <div className="text-center mt-4">
                <Link to={brand === 'all' ? '/menu?category=ice-cream' : `/menu?category=ice-cream&brand=${encodeURIComponent(brand)}`} className="btn btn-osrjc-outline">
                  View All Ice Creams
                </Link>
              </div>
            </Container>
          </section>

          <section className="py-5 osrjc-section-tint" aria-labelledby="gallery-title">
            <Container fluid="lg">
              <div className="osrjc-section-heading">
                <span className="osrjc-eyebrow">Fresh from the Freezer</span>
                <h2 id="gallery-title">Photo Gallery</h2>
                <p className="text-muted small mb-0">Tap a photo to see it bigger.</p>
              </div>
              <PhotoGallery photos={GALLERY} />
            </Container>
          </section>
        </>
      )}

      {/* ---------------- WHY CHOOSE US ---------------- */}
      <section className="py-5 osrjc-section-tint">
        <Container fluid="lg">
          <SectionHeading eyebrow="Our Promise" title="Why Choose Us" />
          <Row className="g-3 g-md-4">
            {FEATURES.map((f, i) => (
              <Col key={f.title} xs={6} lg={3}>
                <Reveal delay={i * 80} className="h-100">
                  <div className="osrjc-feature-card h-100 text-center">
                    <div className="osrjc-feature-icon">
                      <img src={f.image} alt="" loading="lazy" />
                      <span className="osrjc-feature-icon-badge">
                        <i className={`bi ${f.icon}`} aria-hidden="true"></i>
                      </span>
                    </div>
                    <h3 className="h6 fw-bold mt-3">{f.title}</h3>
                    <p className="small text-muted mb-0">{f.text}</p>
                  </div>
                </Reveal>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ---------------- SPECIAL OFFERS ---------------- */}
      <section className="py-5">
        <Container fluid="lg">
          <SectionHeading eyebrow="Don't Miss Out" title="Special Offers" />
          <Row className="g-4">
            {OFFERS.map((offer) => (
              <Col key={offer.id} md={6}>
                <Reveal className="h-100">
                  <div className={`osrjc-offer-card osrjc-offer-${offer.theme}`}>
                    <img src={offer.image} alt="" className="osrjc-offer-card-img" loading="lazy" />
                    <div className="osrjc-offer-card-content">
                      <Badge bg="light" text="dark" className="mb-2">
                        {offer.tag}
                      </Badge>
                      <h3 className="h4 fw-bold text-white mb-2">
                        <i className={`bi ${offer.icon} me-2`} aria-hidden="true"></i>
                        {offer.title}
                      </h3>
                      <p className="text-white mb-3 opacity-75">{offer.text}</p>
                      <Link to={offerLink(offer)} className="btn btn-light btn-sm fw-semibold">
                        {offer.cta.label}
                      </Link>
                    </div>
                  </div>
                </Reveal>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ---------------- REVIEWS ---------------- */}
      <section className="py-5 osrjc-section-tint">
        <Container fluid="lg">
          <SectionHeading
            eyebrow="What People Say"
            title="Customer Reviews"
            note="Demo / sample reviews — they will be replaced with real customer reviews."
          />
          <Row className="g-4">
            {REVIEWS.map((r, i) => (
              <Col key={r.id} md={4}>
                <Reveal delay={i * 80} className="h-100">
                  <Card className="osrjc-review-card h-100 border-0 shadow-sm">
                    <Card.Body>
                      <div className="text-warning mb-2" role="img" aria-label={`${r.rating} out of 5 stars`}>
                        {Array.from({ length: r.rating }).map((_, n) => (
                          <i key={n} className="bi bi-star-fill" aria-hidden="true"></i>
                        ))}
                      </div>
                      <p className="fst-italic mb-3">&ldquo;{r.text}&rdquo;</p>
                      <div className="d-flex align-items-center gap-2">
                        <img src={r.avatar} alt="" className="osrjc-review-avatar" loading="lazy" />
                        <span className="fw-semibold">{r.name}</span>
                      </div>
                      <Badge bg="secondary" className="mt-3">
                        Sample Review
                      </Badge>
                    </Card.Body>
                  </Card>
                </Reveal>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ---------------- ABOUT ---------------- */}
      <section className="py-5">
        <Container fluid="lg">
          <Row className="align-items-center g-4">
            <Col lg={6}>
              <span className="osrjc-eyebrow">Our Story</span>
              <h2 className="mb-3">About Om Sai Ram Juice Center</h2>
              <p className="text-muted">
                Om Sai Ram Juice Center is a local beverage and dessert destination in Sirpur, Burhanpur, Madhya
                Pradesh. We serve fresh juices, refreshing drinks, lassi, badam shakes, faluda and a variety of ice
                creams.
              </p>
              <p className="text-muted mb-3">Serving the local Sirpur community with freshness and taste.</p>
              <ul className="osrjc-check-list mb-4">
                <li>Fresh fruits and quality ingredients</li>
                <li>Clean and hygienic preparation</li>
                <li>Juices, lassi, shakes, faluda and ice creams in one place</li>
              </ul>
              <Link to="/about" className="btn btn-osrjc-outline">
                Learn More About Us
              </Link>
            </Col>
            <Col lg={6}>
              <div className="osrjc-about-visual">
                <img src={shopPhoto || shopStorefront} alt="Om Sai Ram Juice Center, Sirpur" loading="lazy" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ---------------- LOCATION + CONTACT ---------------- */}
      <section className="py-5 osrjc-section-tint">
        <Container fluid="lg">
          <Row className="g-4">
            <Col lg={6}>
              <SectionHeading eyebrow="Find Us" title="Our Location" align="start" />
              <ShopMap />
              <p className="fw-semibold mt-3 mb-0">
                <i className="bi bi-geo-alt-fill text-osrjc-orange me-1" aria-hidden="true"></i>
                {SHOP_INFO.addressLine}
              </p>
            </Col>
            <Col lg={6}>
              <SectionHeading eyebrow="Get In Touch" title="Contact Us" align="start" />
              <div className="osrjc-contact-card">
                <p className="fw-bold mb-1">{SHOP_INFO.name}</p>
                <p className="text-muted small mb-3">
                  <i className="bi bi-geo-alt-fill me-1" aria-hidden="true"></i>Sirpur, Burhanpur, Madhya Pradesh
                  {SHOP_INFO.openingHours && (
                    <>
                      <br />
                      <i className="bi bi-clock me-1" aria-hidden="true"></i>
                      {SHOP_INFO.openingHours}
                    </>
                  )}
                </p>
                {SHOP_INFO.owners.map((owner) => (
                  <div key={owner.phone} className="d-flex justify-content-between align-items-center py-2 border-top gap-2">
                    <span className="fw-semibold">{owner.name}</span>
                    <div className="d-flex gap-2">
                      <a href={`tel:+91${owner.phone}`} className="btn btn-sm btn-osrjc-primary">
                        <i className="bi bi-telephone-fill me-1" aria-hidden="true"></i>Call Now
                      </a>
                      <a
                        href={buildWhatsAppLink(owner.phone, 'Hello, I want to order from Om Sai Ram Juice Center.')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-success"
                      >
                        <i className="bi bi-whatsapp me-1" aria-hidden="true"></i>WhatsApp
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Home;
