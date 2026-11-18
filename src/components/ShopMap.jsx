import { SHOP_INFO } from '../config/shop';

/** Google Maps embed + "open in Maps" button. Needs no API key. */
const ShopMap = ({ height = 320 }) => {
  const q = encodeURIComponent(SHOP_INFO.mapsQuery);
  return (
    <div className="osrjc-map">
      <iframe
        title={`Map showing the location of ${SHOP_INFO.name}`}
        src={`https://www.google.com/maps?q=${q}&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        style={{ height }}
        allowFullScreen
      />
      <a
        className="btn btn-osrjc-primary btn-sm osrjc-map-btn"
        href={`https://www.google.com/maps/search/?api=1&query=${q}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <i className="bi bi-geo-alt-fill me-1" aria-hidden="true"></i>Open in Google Maps
      </a>
    </div>
  );
};

export default ShopMap;
