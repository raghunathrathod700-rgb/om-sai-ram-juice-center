import { useCallback, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';

/** Photo grid + lightbox (click to enlarge, ← → keys, Esc to close). */
const PhotoGallery = ({ photos }) => {
  const [open, setOpen] = useState(-1);
  const show = open >= 0;

  const step = useCallback(
    (dir) => setOpen((i) => (i < 0 ? i : (i + dir + photos.length) % photos.length)),
    [photos.length]
  );

  useEffect(() => {
    if (!show) return undefined;
    const onKey = (e) => {
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [show, step]);

  const current = show ? photos[open] : null;

  return (
    <>
      <div className="osrjc-gallery-grid">
        {photos.map((p, i) => (
          <button
            key={p.id}
            type="button"
            className="osrjc-gallery-tile"
            onClick={() => setOpen(i)}
            aria-label={`Enlarge photo: ${p.alt}`}
          >
            <img src={p.image} alt={p.alt} loading="lazy" />
            <span className="osrjc-gallery-zoom" aria-hidden="true">
              <i className="bi bi-zoom-in"></i>
            </span>
          </button>
        ))}
      </div>

      <Modal show={show} onHide={() => setOpen(-1)} centered size="lg" contentClassName="osrjc-lightbox" aria-label="Photo viewer">
        <Modal.Body className="p-0">
          {current && (
            <figure className="osrjc-lightbox-figure">
              <img src={current.image} alt={current.alt} />
              <figcaption>
                {current.alt} <span className="text-muted">({open + 1}/{photos.length})</span>
              </figcaption>
            </figure>
          )}
          <button type="button" className="osrjc-lightbox-btn close" onClick={() => setOpen(-1)} aria-label="Close photo viewer">
            <i className="bi bi-x-lg" aria-hidden="true"></i>
          </button>
          <button type="button" className="osrjc-lightbox-btn prev" onClick={() => step(-1)} aria-label="Previous photo">
            <i className="bi bi-chevron-left" aria-hidden="true"></i>
          </button>
          <button type="button" className="osrjc-lightbox-btn next" onClick={() => step(1)} aria-label="Next photo">
            <i className="bi bi-chevron-right" aria-hidden="true"></i>
          </button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PhotoGallery;
