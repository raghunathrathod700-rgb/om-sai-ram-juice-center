/**
 * =====================================================================
 * OM SAI RAM JUICE CENTER — PRODUCT DATA (single source of truth)
 * =====================================================================
 * ⚠️ Prices are SAMPLE / DEMO prices and should be updated according to
 * the shop's actual prices. Change the `price` number of any product here
 * and the whole site (cards, cart, checkout, orders) updates itself.
 *
 * Fields
 *   id           unique number (never reuse an id)
 *   name         shown to customers (also decides the photo file name)
 *   category     one of the ids in `categories`
 *   price        in rupees
 *   imageType    juice | lassi | shake | faluda | icecream | combo
 *   color        accent colour of the illustration
 *   brand        ice creams only
 *   rating       OPTIONAL — add only a genuine rating (e.g. rating: 4.5); nothing is shown without it
 *   available    false => shows "Sold Out" and blocks ordering
 *
 * REAL PHOTOS: drop <product-name-slug>.jpg into src/assets/products/
 * (see the README there) — it replaces the illustration automatically.
 * =====================================================================
 */
import { getProductPhoto } from '../utils/productPhotos';

export const categories = [
  { id: 'fresh-juices', name: 'Fresh Juices', icon: 'bi-cup-straw' },
  { id: 'traditional-drinks', name: 'Traditional Drinks', icon: 'bi-cup-hot' },
  { id: 'shakes', name: 'Shakes', icon: 'bi-cup' },
  { id: 'faluda', name: 'Faluda', icon: 'bi-egg-fried' },
  { id: 'ice-cream', name: 'Ice Cream', icon: 'bi-snow2' },
  { id: 'special-items', name: 'Special Items', icon: 'bi-stars' },
];

export const ICE_CREAM_BRANDS = ['Vadilal', 'Creambell', 'Amul', 'Khusboo'];

const rawProducts = [
  // ---------------------- FRESH JUICES (all ₹20) ----------------------
  {
    id: 1,
    name: 'Pineapple Juice',
    category: 'fresh-juices',
    price: 20,
    description: 'Sweet and tangy fresh pineapple juice, made fresh to order with no added preservatives.',
    imageType: 'juice',
    color: '#ffd60a',
    available: true,
  },
  {
    id: 2,
    name: 'Mango Juice',
    category: 'fresh-juices',
    price: 20,
    description: 'Rich and creamy mango juice made from ripe, seasonal mangoes. A summer favourite!',
    imageType: 'juice',
    color: '#ffb700',
    available: true,
  },
  {
    id: 3,
    name: 'Sugarcane Juice',
    category: 'fresh-juices',
    price: 20,
    description: 'Freshly extracted sugarcane juice with a hint of lemon and ginger — naturally refreshing.',
    imageType: 'juice',
    color: '#b7d94c',
    available: true,
  },
  {
    id: 4,
    name: 'Lemon Water',
    category: 'fresh-juices',
    price: 20,
    description: 'Chilled lemon water (nimbu pani) with a perfect balance of sweet, salty and tangy.',
    imageType: 'juice',
    color: '#e8ff6b',
    available: true,
  },
  {
    id: 5,
    name: 'Apple Juice',
    category: 'fresh-juices',
    price: 20,
    description: 'Freshly pressed apple juice, crisp and naturally sweet with no added sugar.',
    imageType: 'juice',
    color: '#e63946',
    available: true,
  },
  {
    id: 6,
    name: 'Orange Juice',
    category: 'fresh-juices',
    price: 20,
    description: 'Vitamin C rich, freshly squeezed orange juice served chilled.',
    imageType: 'juice',
    color: '#ff8c00',
    available: true,
  },
  {
    id: 7,
    name: 'Watermelon Juice',
    category: 'fresh-juices',
    price: 20,
    description: 'Cooling watermelon juice — the perfect thirst quencher on a hot Sirpur afternoon.',
    imageType: 'juice',
    color: '#ff4d6d',
    available: true,
  },
  // ---------------------- TRADITIONAL DRINKS (lassi ₹35) ----------------------
  {
    id: 8,
    name: 'Plain Lassi',
    category: 'traditional-drinks',
    price: 35,
    description: 'Thick and creamy traditional plain lassi churned from fresh curd.',
    imageType: 'lassi',
    color: '#fff3b0',
    available: true,
  },
  {
    id: 9,
    name: 'Sweet Lassi',
    category: 'traditional-drinks',
    price: 35,
    description: 'Classic sweet lassi topped with a dollop of fresh cream.',
    imageType: 'lassi',
    color: '#ffe066',
    available: true,
  },
  {
    id: 10,
    name: 'Mango Lassi',
    category: 'traditional-drinks',
    price: 35,
    description: 'Seasonal mango pulp blended with fresh curd for a rich, fruity lassi.',
    imageType: 'lassi',
    color: '#ffb700',
    available: true,
  },
  {
    id: 11,
    name: 'Chaas (Buttermilk)',
    category: 'traditional-drinks',
    price: 25,
    description: 'Light and spiced buttermilk, great for digestion and a hot day cooler.',
    imageType: 'lassi',
    color: '#eaf6da',
    available: true,
  },
  // ---------------------- SHAKES ----------------------
  {
    id: 12,
    name: 'Badam Shake',
    category: 'shakes',
    price: 45,
    description: 'Rich almond (badam) milkshake garnished with chopped dry fruits.',
    imageType: 'shake',
    color: '#e9c46a',
    available: true,
  },
  {
    id: 13,
    name: 'Chocolate Shake',
    category: 'shakes',
    price: 85,
    description: 'Thick chocolate milkshake made with real cocoa and chocolate ice cream.',
    imageType: 'shake',
    color: '#6f4518',
    available: true,
  },
  {
    id: 14,
    name: 'Strawberry Shake',
    category: 'shakes',
    price: 85,
    description: 'Fruity and creamy strawberry milkshake blended with fresh strawberry crush.',
    imageType: 'shake',
    color: '#ff6b8a',
    available: true,
  },
  {
    id: 15,
    name: 'Banana Shake',
    category: 'shakes',
    price: 70,
    description: 'Wholesome banana milkshake — thick, filling and naturally sweet.',
    imageType: 'shake',
    color: '#ffe066',
    available: true,
  },
  {
    id: 16,
    name: 'Chocolate Coffee',
    category: 'shakes',
    price: 50,
    description: 'Chilled chocolate-laced cold coffee — a smooth, energising treat.',
    imageType: 'shake',
    color: '#4b2e1e',
    available: true,
  },
  // ---------------------- FALUDA (exactly two items, ₹70) ----------------------
  {
    id: 17,
    name: 'Royal Faluda',
    category: 'faluda',
    price: 70,
    description: 'A royal treat of rose syrup, vermicelli, basil seeds, jelly, dry fruits and ice cream.',
    imageType: 'faluda',
    color: '#ff70a6',
    available: true,
  },
  {
    id: 18,
    name: 'Icecream Faluda',
    category: 'faluda',
    price: 70,
    description: 'Classic faluda topped with a generous scoop of creamy ice cream, basil seeds and sev.',
    imageType: 'faluda',
    color: '#f4a261',
    available: true,
  },
  // ---------------------- ICE CREAM ----------------------
  {
    id: 19,
    name: 'Vanilla',
    category: 'ice-cream',
    price: 50,
    brand: 'Amul',
    description: 'Classic and creamy vanilla ice cream scoop.',
    imageType: 'icecream',
    color: '#fefae0',
    available: true,
  },
  {
    id: 20,
    name: 'Chocolate',
    category: 'ice-cream',
    price: 55,
    brand: 'Amul',
    description: 'Rich chocolate ice cream made with real cocoa.',
    imageType: 'icecream',
    color: '#6f4518',
    available: true,
  },
  {
    id: 21,
    name: 'Strawberry',
    category: 'ice-cream',
    price: 55,
    brand: 'Vadilal',
    description: 'Fruity strawberry ice cream with real fruit chunks.',
    imageType: 'icecream',
    color: '#ff6b8a',
    available: true,
  },
  {
    id: 22,
    name: 'Butterscotch',
    category: 'ice-cream',
    price: 60,
    brand: 'Creambell',
    description: 'Crunchy caramelised butterscotch chips folded into creamy ice cream.',
    imageType: 'icecream',
    color: '#e9c46a',
    available: true,
  },
  {
    id: 23,
    name: 'Mango',
    category: 'ice-cream',
    price: 60,
    brand: 'Vadilal',
    description: 'Seasonal mango ice cream bursting with Alphonso mango flavour.',
    imageType: 'icecream',
    color: '#ffb700',
    available: true,
  },
  {
    id: 24,
    name: 'Black Currant',
    category: 'ice-cream',
    price: 55,
    brand: 'Khusboo',
    description: 'Tangy-sweet black currant flavoured ice cream.',
    imageType: 'icecream',
    color: '#5e2a8c',
    available: true,
  },
  {
    id: 25,
    name: 'Chocolate Brownie',
    category: 'ice-cream',
    price: 70,
    brand: 'Creambell',
    description: 'Chocolate ice cream loaded with chunks of fudgy brownie.',
    imageType: 'icecream',
    color: '#4a2c1a',
    available: true,
  },
  {
    id: 26,
    name: 'Kesar Pista',
    category: 'ice-cream',
    price: 65,
    brand: 'Vadilal',
    description: 'Traditional saffron and pistachio flavoured premium ice cream.',
    imageType: 'icecream',
    color: '#b5c98e',
    available: true,
  },
  {
    id: 27,
    name: 'Rajbhog',
    category: 'ice-cream',
    price: 65,
    brand: 'Vadilal',
    description: 'Royal blend of dry fruits, saffron and rabri flavours.',
    imageType: 'icecream',
    color: '#ffd166',
    available: true,
  },
  {
    id: 28,
    name: 'Choco Chip',
    category: 'ice-cream',
    price: 60,
    brand: 'Amul',
    description: 'Vanilla ice cream loaded with crunchy chocolate chips.',
    imageType: 'icecream',
    color: '#2b2d42',
    available: true,
  },
  // ---------------------- SPECIAL ITEMS ----------------------
  {
    id: 29,
    name: 'Juice + Ice Cream Combo',
    category: 'special-items',
    price: 130,
    description: 'Special combo of any fresh juice with a scoop of your favourite ice cream.',
    imageType: 'combo',
    color: '#2a9d8f',
    available: true,
  },
  {
    id: 30,
    name: 'Summer Special Mango Delight',
    category: 'special-items',
    price: 140,
    description: 'Mango juice, mango ice cream and faluda sev — a mango lover’s dream.',
    imageType: 'combo',
    color: '#ffb700',
    available: true,
  },
];

/** Final list used by the app — real photo attached automatically when present. */
export const products = rawProducts.map((p) => ({ ...p, photo: getProductPhoto(p.name) }));
