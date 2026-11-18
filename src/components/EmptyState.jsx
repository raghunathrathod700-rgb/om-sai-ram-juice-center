import { Link } from 'react-router-dom';

const EmptyState = ({ icon = 'bi-emoji-frown', title, text, actionLabel, actionTo }) => (
  <div className="osrjc-empty text-center">
    <i className={`bi ${icon} display-4 text-muted d-block mb-3`} aria-hidden="true"></i>
    <h2 className="h5">{title}</h2>
    {text && <p className="text-muted">{text}</p>}
    {actionTo && (
      <Link to={actionTo} className="btn btn-osrjc-primary mt-2">
        {actionLabel}
      </Link>
    )}
  </div>
);

export default EmptyState;
