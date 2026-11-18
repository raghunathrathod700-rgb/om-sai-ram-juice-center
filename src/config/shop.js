/**
 * SHOP CONFIGURATION — the one place to edit business details.
 * Prices live in src/data/products.js (sample/demo prices — update them there).
 */
export const SHOP_INFO = {
  name: 'Om Sai Ram Juice Center',
  addressLine: 'Sirpur, Burhanpur, Madhya Pradesh, India',

  // ---- Delivery rule -------------------------------------------------
  deliveryRadiusMeters: 500,
  deliveryFee: 0, // ₹ — change if you ever want to charge for delivery

  // Shop GPS position. While this is `null` the delivery check runs in DEMO
  // mode (text based, not real distance). Put the real values to switch on
  // the real GPS / Haversine check, e.g. { lat: 21.3, lng: 76.2 }.
  coordinates: null,

  // ---- UPI / PhonePe QR payment ---------------------------------------
  // Put the shop's UPI id (shown to customers + used for the "Open UPI app"
  // button). Put the PhonePe QR image at src/assets/payment/phonepe-qr.png
  // (jpg / jpeg / webp also fine). Payments done through the QR are NEVER
  // marked "Paid" automatically — the shop verifies them manually.
  upiId: '',
  upiPayeeName: 'Om Sai Ram Juice Center',

  // ---- Optional details: shown on the site ONLY when filled in ------------
  openingHours: '', // e.g. 'Daily 9:00 AM – 10:00 PM'
  socials: { instagram: '', facebook: '', youtube: '' }, // full profile URLs
  mapsQuery: 'Om Sai Ram Juice Center, Sirpur, Burhanpur, Madhya Pradesh', // Google Maps search text

  owners: [
    { name: 'Raghunath Rathod', phone: '8458902317' },
    { name: 'Laxman Rathod', phone: '9329017011' },
    { name: 'Jagdish Rathod', phone: '8643092943' },
  ],
};

// Backend address. Empty => the website runs in LOCAL DEMO mode (browser storage only).
// Set VITE_API_BASE_URL=http://localhost:8080 to use the Spring Boot + MySQL backend (real orders, admin panel).
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
export const USE_API = !!API_BASE_URL;

// Public (browser-safe) payment settings coming from .env — see .env.example
export const PAYMENT_ENV = {
  razorpayKeyId: import.meta.env.VITE_RAZORPAY_KEY_ID || '', // local demo mode only; with the backend the key comes from the server
  apiBaseUrl: API_BASE_URL,
};
