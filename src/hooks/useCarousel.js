import { useCallback, useEffect, useMemo, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

/**
 * Shared auto-playing carousel logic (hero gallery + banner slider).
 * Autoplay pauses on hover / keyboard focus and is switched off completely
 * when the visitor prefers reduced motion.
 */
export const useCarousel = (length, interval = 4200) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();

  const go = useCallback((i) => setIndex((((i % length) + length) % length) || 0), [length]);
  const next = useCallback(() => setIndex((i) => (i + 1) % length), [length]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + length) % length), [length]);

  useEffect(() => {
    if (paused || reduced || length < 2) return undefined;
    const id = setTimeout(next, interval);
    return () => clearTimeout(id); // restarts after every manual change too
  }, [index, paused, reduced, length, interval, next]);

  const pauseProps = useMemo(
    () => ({
      onMouseEnter: () => setPaused(true),
      onMouseLeave: () => setPaused(false),
      onFocus: () => setPaused(true),
      onBlur: () => setPaused(false),
    }),
    []
  );

  return { index, go, next, prev, paused, pauseProps };
};
