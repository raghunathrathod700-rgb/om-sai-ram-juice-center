import { memo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useFavourites } from '../context/FavouritesContext';
import { useToast } from '../context/ToastContext';
import { getCategoryName } from '../services/productService';
import { formatCurrency } from '../utils/helpers';
import { flyToCart } from '../utils/flyToCart';
import ProductThumb from './ProductThumb';
import QuantitySelector from './QuantitySelector';

const ProductCard = memo(({ product }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { isFavourite, toggleFavourite } = useFavourites();
  const [qty, setQty] = useState(1);
  const mediaRef = useRef(null);
  const fav = isFavourite(product.id);

  const handleAdd = () => {
    flyToCart(mediaRef.current);
    addToCart(product, qty);
    showToast(`${product.name} added to cart!`, 'success', 'bi-cart-check-fill');
    setQty(1);
  };

  return (
    <article className="osrjc-product-card card h-100 border-0 shadow-sm">
      <div className="osrjc-product-media" ref={mediaRef}>
        <Link to={`/product/${product.id}`} className="osrjc-product-image-link" aria-label={`View ${product.name}`}>
          <ProductThumb product={product} />
        </Link>
        <button
          type="button"
          className={`osrjc-fav-btn ${fav ? 'active' : ''}`}
          onClick={() => toggleFavourite(product.id)}
          aria-pressed={fav}
          aria-label={fav ? `Remove ${product.name} from favourites` : `Add ${product.name} to favourites`}
        >
          <i className={`bi ${fav ? 'bi-heart-fill' : 'bi-heart'}`} aria-hidden="true"></i>
        </button>
        {!product.available && <span className="osrjc-badge-unavailable">Sold Out</span>}
      </div>

      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start gap-2">
          <h3 className="osrjc-product-name h6 mb-1">
            <Link to={`/product/${product.id}`} className="text-decoration-none text-reset">
              {product.name}
            </Link>
          </h3>
          {product.rating ? (
            <span className="osrjc-rating small">
              <i className="bi bi-star-fill text-warning" aria-hidden="true"></i> {product.rating}
            </span>
          ) : null}
        </div>
        <div className="small text-muted mb-1">
          {product.brand ? `${product.brand} • ` : ''}
          {getCategoryName(product.category)}
        </div>
        <p className="small text-muted osrjc-product-desc mb-2">{product.description}</p>

        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="osrjc-price fw-bold fs-5">{formatCurrency(product.price)}</span>
            <QuantitySelector value={qty} onChange={setQty} label={product.name} />
          </div>
          <button
            type="button"
            className="btn btn-osrjc-primary w-100 fw-semibold"
            onClick={handleAdd}
            disabled={!product.available}
          >
            <i className="bi bi-cart-plus me-1" aria-hidden="true"></i>
            {product.available ? 'Add to Cart' : 'Sold Out'}
          </button>
        </div>
      </div>
    </article>
  );
});

ProductCard.displayName = 'ProductCard';
export default ProductCard;
