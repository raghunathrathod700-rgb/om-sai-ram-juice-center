import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Badge, Col, Container, Row } from 'react-bootstrap';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import PageMeta from '../components/PageMeta';
import ProductCard from '../components/ProductCard';
import ProductThumb from '../components/ProductThumb';
import QuantitySelector from '../components/QuantitySelector';
import RatingStars from '../components/RatingStars';
import { SHOP_INFO } from '../config/shop';
import { useCart } from '../context/CartContext';
import { useFavourites } from '../context/FavouritesContext';
import { useToast } from '../context/ToastContext';
import { useProducts } from '../hooks/useProducts';
import { getCategoryName, getRelatedProducts } from '../services/productService';
import { formatCurrency } from '../utils/helpers';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { isFavourite, toggleFavourite } = useFavourites();
  const [qty, setQty] = useState(1);

  const product = products.find((p) => String(p.id) === String(id));

  useEffect(() => {
    setQty(1);
  }, [id]);

  if (loading) return <LoadingSpinner fullPage text="Loading product details..." />;

  if (!product) {
    return (
      <Container fluid="lg" className="py-5">
        <EmptyState
          icon="bi-exclamation-circle"
          title="Product not found"
          text="This item doesn't exist or is no longer available."
          actionLabel="Back to Menu"
          actionTo="/menu"
        />
      </Container>
    );
  }

  const related = getRelatedProducts(product);
  const fav = isFavourite(product.id);

  const handleAdd = () => {
    addToCart(product, qty);
    showToast(`${product.name} added to cart!`, 'success', 'bi-cart-check-fill');
  };

  const handleBuyNow = () => {
    addToCart(product, qty);
    navigate('/checkout');
  };

  return (
    <>
      <PageMeta title={`${product.name} — ${formatCurrency(product.price)}`} description={product.description} />

      <Container fluid="lg" className="py-4">
        <nav aria-label="breadcrumb" className="small text-muted mb-3">
          <Link to="/" className="text-decoration-none">Home</Link> /{' '}
          <Link to="/menu" className="text-decoration-none">Menu</Link> / <span>{product.name}</span>
        </nav>

        <Row className="g-4 g-lg-5">
          <Col lg={6}>
            <div className="osrjc-product-detail-image">
              <ProductThumb product={product} />
              <button
                type="button"
                className={`osrjc-fav-btn ${fav ? 'active' : ''}`}
                onClick={() => toggleFavourite(product.id)}
                aria-pressed={fav}
                aria-label={fav ? 'Remove from favourites' : 'Add to favourites'}
              >
                <i className={`bi ${fav ? 'bi-heart-fill' : 'bi-heart'}`} aria-hidden="true"></i>
              </button>
            </div>
          </Col>

          <Col lg={6}>
            <Badge bg="light" text="dark" className="mb-2 border">
              {getCategoryName(product.category)}
            </Badge>
            <h1 className="h2 fw-bold mb-2">{product.name}</h1>
            {product.brand && (
              <p className="text-muted mb-2">
                Brand: <strong>{product.brand}</strong>
              </p>
            )}
            {product.rating ? (
              <div className="d-flex align-items-center gap-2 mb-3">
                <RatingStars rating={product.rating} />
                <span className="text-muted small">({product.rating})</span>
              </div>
            ) : null}
            <p className="text-muted mb-4">{product.description}</p>
            <div className="osrjc-price-display mb-4">{formatCurrency(product.price)}</div>

            {!product.available && <Badge bg="danger" className="mb-3">Currently Sold Out</Badge>}

            <div className="d-flex align-items-center gap-3 mb-4">
              <span className="fw-semibold">Quantity:</span>
              <QuantitySelector value={qty} onChange={setQty} label={product.name} size="lg" />
              <span className="text-muted small">= {formatCurrency(product.price * qty)}</span>
            </div>

            <div className="d-flex flex-wrap gap-3">
              <button type="button" className="btn btn-osrjc-outline btn-lg flex-grow-1" onClick={handleAdd} disabled={!product.available}>
                <i className="bi bi-cart-plus me-2" aria-hidden="true"></i>Add to Cart
              </button>
              <button type="button" className="btn btn-osrjc-primary btn-lg flex-grow-1" onClick={handleBuyNow} disabled={!product.available}>
                <i className="bi bi-lightning-charge-fill me-2" aria-hidden="true"></i>Buy Now
              </button>
            </div>

            <div className="osrjc-delivery-note mt-4">
              <i className="bi bi-truck me-2" aria-hidden="true"></i>
              Online delivery available only within {SHOP_INFO.deliveryRadiusMeters} meters of our Sirpur shop.
            </div>
          </Col>
        </Row>

        {related.length > 0 && (
          <section className="mt-5 pt-4 border-top" aria-labelledby="related-title">
            <h2 id="related-title" className="h4 fw-bold mb-4">You may also like</h2>
            <Row className="g-3 g-md-4">
              {related.map((p) => (
                <Col key={p.id} xs={6} md={4} lg={3}>
                  <ProductCard product={p} />
                </Col>
              ))}
            </Row>
          </section>
        )}
      </Container>
    </>
  );
};

export default ProductDetails;
