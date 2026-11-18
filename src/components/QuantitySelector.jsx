/** − 1 + control. With min={0} the minus button removes the item (cart). */
const QuantitySelector = ({ value, onChange, min = 1, max = 10, label = 'item', size = 'md' }) => (
  <div className={`osrjc-qty ${size === 'lg' ? 'osrjc-qty-lg' : ''}`}>
    <button
      type="button"
      aria-label={`Decrease quantity of ${label}`}
      onClick={() => onChange(value - 1)}
      disabled={value <= min}
    >
      &minus;
    </button>
    <output aria-live="polite">{value}</output>
    <button
      type="button"
      aria-label={`Increase quantity of ${label}`}
      onClick={() => onChange(value + 1)}
      disabled={value >= max}
    >
      +
    </button>
  </div>
);

export default QuantitySelector;
