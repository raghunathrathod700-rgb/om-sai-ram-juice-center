import { useEffect, useState } from 'react';

const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goTop = () => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <button
      type="button"
      className={`osrjc-back-top ${visible ? 'show' : ''}`}
      onClick={goTop}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
    >
      <i className="bi bi-arrow-up" aria-hidden="true"></i>
    </button>
  );
};

export default BackToTop;
