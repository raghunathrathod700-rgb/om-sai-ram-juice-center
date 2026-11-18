const LoadingSpinner = ({ text = 'Loading fresh goodness...', fullPage = false }) => (
  <div
    className={`d-flex flex-column align-items-center justify-content-center gap-3 ${
      fullPage ? 'osrjc-loading-fullpage' : 'py-5'
    }`}
    role="status"
    aria-live="polite"
  >
    <div className="osrjc-spinner" aria-hidden="true">
      <i className="bi bi-cup-straw"></i>
    </div>
    <p className="text-muted mb-0 fw-medium">{text}</p>
  </div>
);

export default LoadingSpinner;
