import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/helpers';
import ProductThumb from './ProductThumb';
import QuantitySelector from './QuantitySelector';

const CartItem = memo(({ item, compact = false }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className={`osrjc-cart-item ${compact ? 'compact' : ''}`}>
      <Link to={`/product/${item.id}`} className="flex-shrink-0" aria-label={`View ${item.name}`}>
        <ProductThumb product={item} className="osrjc-cart-item-img" />
      </Link>
      <div className="flex-grow-1 min-width-0">
        <Link to={`/product/${item.id}`} className="text-decoration-none text-reset">
          <h3 className="h6 mb-1 text-truncate">{item.name}</h3>
        </Link>
        <div className="text-muted small mb-2">{formatCurrency(item.price)} each</div>
        {/* min={0}: pressing "−" at quantity 1 removes the item */}
        <QuantitySelector
          value={item.quantity}
          min={0}
          max={20}
          label={item.name}
          onChange={(q) => updateQuantity(item.id, q)}
        />
      </div>
      <div className="text-end flex-shrink-0">
        <div className="fw-bold mb-2">{formatCurrency(item.price * item.quantity)}</div>
        <button
          type="button"
          className="btn btn-sm btn-outline-danger"
          onClick={() => removeFromCart(item.id)}
          aria-label={`Remove ${item.name} from cart`}
        >
          <i className="bi bi-trash3" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  );
});

CartItem.displayName = 'CartItem';
export default CartItem;
