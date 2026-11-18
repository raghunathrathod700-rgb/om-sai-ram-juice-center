import { Link } from 'react-router-dom';
import { useCarousel } from '../hooks/useCarousel';
import { useProducts } from '../hooks/useProducts';
import { formatCurrency } from '../utils/helpers';

/** Hero photo slider inside an animated blob frame. Fades between real photos; dots are clickable. */
const HeroGallery = ({ slides }) => {
  const { index, go, pauseProps } = useCarousel(slides.length, 3800);
  const { products } = useProducts();

  return (
    <div className="osrjc-hero-stage" role="region" aria-roledescription="carousel" aria-label="Our fresh drinks">
      <span className="osrjc-hero-blob" aria-hidden="true"></span>
      <span className="osrjc-hero-ring" aria-hidden="true"></span>

      <div className="osrjc-hero-frame" {...pauseProps}>
        {slides.map((slide, i) => {
          const active = i === index;
          const product = slide.productName
            ? products.find((p) => p.name.toLowerCase() === slide.productName.toLowerCase())
            : null;
          const link = product ? `/product/${product.id}` : slide.to;
          return (
            <Link
              key={slide.id}
              to={link}
              className={`osrjc-hero-slide ${active ? 'active' : ''}`}
              tabIndex={active ? 0 : -1}
              aria-hidden={!active}
              aria-label={`${product ? product.name : slide.label || slide.alt} — view`}
            >
              <img src={slide.image} alt={slide.alt} loading={i === 0 ? 'eager' : 'lazy'} draggable="false" />
              <span className="osrjc-hero-caption">
                <strong>{product ? product.name : slide.label || slide.productName}</strong>
                {product && <em>{formatCurrency(product.price)}</em>}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="osrjc-hero-dots" role="tablist" aria-label="Choose photo">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Show photo ${i + 1} of ${slides.length}`}
            className={i === index ? 'active' : ''}
            onClick={() => go(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroGallery;
