import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Scrolls to top on every route change (instant when the user prefers reduced motion). */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  }, [pathname]);
  return null;
};

export default ScrollToTop;
