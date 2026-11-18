/**
 * "Add to cart" animation: a copy of the product picture flies to the cart icon
 * (the element marked with data-cart-target). Silent no-op when the user prefers
 * reduced motion or the elements are not visible.
 */
export const flyToCart = (sourceEl) => {
  if (typeof document === 'undefined' || !sourceEl) return;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  const target = document.querySelector('[data-cart-target]');
  if (!target || typeof sourceEl.animate !== 'function') return;

  const from = sourceEl.getBoundingClientRect();
  const to = target.getBoundingClientRect();
  if (!from.width || !to.width) return;

  const ghost = document.createElement('div');
  ghost.className = 'osrjc-fly';
  const img = sourceEl.querySelector('img');
  if (img) ghost.style.backgroundImage = `url("${img.currentSrc || img.src}")`;
  Object.assign(ghost.style, {
    left: `${from.left}px`,
    top: `${from.top}px`,
    width: `${from.width}px`,
    height: `${from.height}px`,
  });
  document.body.appendChild(ghost);

  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);
  const animation = ghost.animate(
    [
      { transform: 'translate(0, 0) scale(1)', opacity: 1, borderRadius: '18px' },
      { transform: `translate(${dx * 0.6}px, ${dy * 0.35}px) scale(.45)`, opacity: 0.95, borderRadius: '40%', offset: 0.55 },
      { transform: `translate(${dx}px, ${dy}px) scale(.06)`, opacity: 0.3, borderRadius: '50%' },
    ],
    { duration: 700, easing: 'cubic-bezier(.45,.05,.55,.95)' }
  );
  const cleanup = () => ghost.remove();
  animation.onfinish = cleanup;
  animation.oncancel = cleanup;
};
