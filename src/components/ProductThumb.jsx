import ProductImage from './ProductImage';

/** Shows the real photo when one exists, otherwise the drawn illustration. */
const ProductThumb = ({ product, className = '' }) =>
  product.photo ? (
    <img src={product.photo} alt={product.name} className={className} loading="lazy" />
  ) : (
    <ProductImage type={product.imageType} color={product.color} title={product.name} className={className} />
  );

export default ProductThumb;
