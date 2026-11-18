import { useEffect, useRef, useState } from 'react';
import { SHOP_INFO } from '../config/shop';
import { checkAddress, checkByGps, isGpsCheckEnabled } from '../services/deliveryService';

/**
 * Delivery-distance validation UI.
 *  showInput=true   -> has its own address box (Home / Delivery page)
 *  showInput=false  -> checks the `address` prop (Checkout form) and renders no <form>
 * Calls onResult(result) with { eligible, distance, mode } — or null when the
 * address was edited and the previous result is no longer valid.
 */
const DeliveryChecker = ({ showInput = true, address = '', onResult }) => {
  const [typed, setTyped] = useState('');
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const onResultRef = useRef(onResult);
  const current = showInput ? typed : address;

  useEffect(() => {
    onResultRef.current = onResult;
  });

  // an edited address invalidates the previous answer
  useEffect(() => {
    setResult(null);
    setError('');
    onResultRef.current?.(null);
  }, [current]);

  const run = async (task) => {
    setChecking(true);
    setError('');
    try {
      const res = await task();
      if (res.error) {
        setResult(null);
        setError(res.error);
        onResultRef.current?.(null);
      } else {
        setResult(res);
        onResultRef.current?.(res);
      }
    } catch (err) {
      setResult(null);
      setError(err.message);
      onResultRef.current?.(null);
    } finally {
      setChecking(false);
    }
  };

  const checkText = () =>
    run(async () => {
      await new Promise((resolve) => setTimeout(resolve, 450));
      return checkAddress(current);
    });

  const submit = (e) => {
    e.preventDefault();
    checkText();
  };

  const buttons = (
    <div className="d-flex flex-column flex-sm-row gap-2">
      <button
        type={showInput ? 'submit' : 'button'}
        className="btn btn-warning fw-semibold text-nowrap"
        onClick={showInput ? undefined : checkText}
        disabled={checking}
      >
        {checking ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Checking...
          </>
        ) : (
          <>
            <i className="bi bi-geo-alt me-1" aria-hidden="true"></i> Check Delivery Availability
          </>
        )}
      </button>
      {isGpsCheckEnabled() && (
        <button type="button" className="btn btn-outline-secondary text-nowrap" onClick={() => run(checkByGps)} disabled={checking}>
          <i className="bi bi-crosshair me-1" aria-hidden="true"></i> Use my location
        </button>
      )}
    </div>
  );

  return (
    <div className="osrjc-delivery-checker">
      {showInput ? (
        <form onSubmit={submit} className="d-flex flex-column gap-2">
          <label htmlFor="delivery-address" className="visually-hidden">
            Your delivery address
          </label>
          <input
            id="delivery-address"
            type="text"
            className="form-control"
            placeholder="Enter your address / area (e.g. Near Sirpur Chowk)"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            required
          />
          {buttons}
        </form>
      ) : (
        buttons
      )}

      {error && (
        <div className="alert alert-warning mt-3 mb-0 py-2 small" role="alert">
          {error}
        </div>
      )}

      {result && (
        <div className={`alert ${result.eligible ? 'alert-success' : 'alert-danger'} mt-3 mb-0`} role="alert">
          <div className="d-flex align-items-start gap-2">
            <i
              className={`bi ${result.eligible ? 'bi-check-circle-fill' : 'bi-x-circle-fill'} fs-5`}
              aria-hidden="true"
            ></i>
            <div>
              <strong>{result.message}</strong>
              <div className="small mt-1">
                {result.mode === 'gps'
                  ? `You are about ${result.distance} m from ${SHOP_INFO.name} (GPS accuracy ±${result.accuracy} m).`
                  : `Demo estimate: about ${result.distance} m. This is a simulated check, not a real GPS distance.`}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryChecker;
