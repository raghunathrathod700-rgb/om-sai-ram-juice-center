/**
 * DELIVERY SERVICE — the 500 metre rule.
 * ---------------------------------------------------------------------
 * Two modes:
 *  1. GPS mode  — active when SHOP_INFO.coordinates is filled in
 *     (src/config/shop.js). Uses the browser Geolocation API and a real
 *     Haversine distance to the shop.
 *  2. DEMO mode — (default) NOT a real distance. A text address that
 *     mentions "Sirpur" gets a simulated 80–480 m distance, anything else
 *     a simulated 600 m+ distance. Same address => same answer.
 * The UI always says which mode produced the answer.
 * ---------------------------------------------------------------------
 */
import { SHOP_INFO } from '../config/shop';
import { haversineMeters } from '../utils/helpers';

const hashString = (text) => {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const buildResult = (distance, mode, extra = {}) => {
  const eligible = distance <= SHOP_INFO.deliveryRadiusMeters;
  return {
    eligible,
    distance,
    mode,
    message: eligible
      ? 'Delivery Available'
      : `Sorry, delivery is available only within ${SHOP_INFO.deliveryRadiusMeters} meters.`,
    ...extra,
  };
};

export const isGpsCheckEnabled = () => !!SHOP_INFO.coordinates;

export const checkAddress = (addressText = '') => {
  const text = addressText.trim().toLowerCase();
  if (text.length < 5) return { error: 'Please enter your delivery address first.' };
  const h = hashString(text);
  const distance = /sirpur/.test(text) ? 80 + (h % 400) : 600 + (h % 4000);
  return buildResult(distance, 'demo');
};

export const checkByGps = () =>
  new Promise((resolve, reject) => {
    if (!SHOP_INFO.coordinates) {
      reject(new Error('GPS check is not configured yet (shop coordinates missing).'));
      return;
    }
    if (!globalThis.navigator?.geolocation) {
      reject(new Error('Your browser does not support location access.'));
      return;
    }
    globalThis.navigator.geolocation.getCurrentPosition(
      (pos) => {
        const distance = Math.round(
          haversineMeters(SHOP_INFO.coordinates, { lat: pos.coords.latitude, lng: pos.coords.longitude })
        );
        resolve(
          buildResult(distance, 'gps', {
            accuracy: Math.round(pos.coords.accuracy),
            coords: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          })
        );
      },
      (err) =>
        reject(new Error(err.code === 1 ? 'Location permission was denied.' : 'Could not detect your location.')),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
