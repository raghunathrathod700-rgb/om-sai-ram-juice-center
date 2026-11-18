import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCarousel } from '../hooks/useCarousel';

/**
 * Full-width banner slider: autoplay, arrows, dots, swipe (touch / drag), keyboard arrows.
 * Images are shown whole (never cropped) on top of a blurred copy of themselves,
 * so banner text stays readable on every screen size.
 */
const BannerSlider = ({ slides, label = 'Ice cream banners' }) => {
  const { index, go, next, prev, pauseProps } = useCarousel(slides.length, 4800);
  const startX = useRef(null);
  const swiped = useRef(false);

  const onPointerDown = (e) => {
    startX.current = e.clientX;
    swiped.current = false;
  };
  const onPointerUp = (e) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) > 45) {
      swiped.current = true;
      if (dx < 0) next();
      else prev();
    }
  };
  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  };

  return (
    <div
      className="osrjc-slider"
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={onKeyDown}
      {...pauseProps}
    >
      <div
        className="osrjc-slider-viewport"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          startX.current = null;
        }}
        onClickCapture={(e) => {
          if (swiped.current) {
            e.preventDefault();
            swiped.current = false;
          }
        }}
      >
        {slides.map((slide, i) => {
          const active = i === index;
          return (
            <Link
              key={slide.id}
              to={slide.to}
              className={`osrjc-slide ${active ? 'active' : ''}`}
              tabIndex={active ? 0 : -1}
              aria-hidden={!active}
              aria-label={`${slide.alt} (${i + 1} of ${slides.length})`}
              draggable="false"
            >
              <span className="osrjc-slide-bg" style={{ backgroundImage: `url(${slide.image})` }} aria-hidden="true"></span>
              <img src={slide.image} alt={slide.alt} loading={i === 0 ? 'eager' : 'lazy'} draggable="false" />
            </Link>
          );
        })}
      </div>

      <button type="button" className="osrjc-slider-arrow prev" onClick={prev} aria-label="Previous banner">
        <i className="bi bi-chevron-left" aria-hidden="true"></i>
      </button>
      <button type="button" className="osrjc-slider-arrow next" onClick={next} aria-label="Next banner">
        <i className="bi bi-chevron-right" aria-hidden="true"></i>
      </button>

      <div className="osrjc-slider-dots">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            className={i === index ? 'active' : ''}
            aria-label={`Go to banner ${i + 1}`}
            aria-current={i === index}
            onClick={() => go(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerSlider;
