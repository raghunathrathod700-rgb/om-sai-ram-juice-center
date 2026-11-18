/**
 * Editable marketing content (offers, reviews, features).
 * Change text here — the Home page re-renders automatically.
 */
import fruitMango from '../assets/illustrations/fruit-mango.svg';
import fruitPineapple from '../assets/illustrations/fruit-pineapple.svg';
import fruitLemon from '../assets/illustrations/fruit-lemon.svg';
import fruitApple from '../assets/illustrations/fruit-apple.svg';
import fruitOrange from '../assets/illustrations/fruit-orange.svg';
import fruitWatermelon from '../assets/illustrations/fruit-watermelon.svg';
import featureHygiene from '../assets/illustrations/feature-hygiene.svg';
import featureVariety from '../assets/illustrations/feature-variety.svg';
import featureDelivery from '../assets/illustrations/feature-delivery.svg';
import avatar1 from '../assets/illustrations/avatar-1.svg';
import avatar2 from '../assets/illustrations/avatar-2.svg';
import avatar3 from '../assets/illustrations/avatar-3.svg';

export const HERO_WORDS = ['Fresh Juices', 'Creamy Lassi', 'Royal Faluda', 'Ice Creams', 'Badam Shake'];

export const FLOATING_FRUITS = [
  { image: fruitMango, className: 'fruit-1' },
  { image: fruitPineapple, className: 'fruit-2' },
  { image: fruitLemon, className: 'fruit-3' },
  { image: fruitApple, className: 'fruit-4' },
  { image: fruitOrange, className: 'fruit-5' },
  { image: fruitWatermelon, className: 'fruit-6' },
];

export const FEATURES = [
  { image: fruitMango, icon: 'bi-flower2', title: 'Fresh Ingredients', text: 'Fresh fruits and quality ingredients.' },
  { image: featureHygiene, icon: 'bi-shield-check', title: 'Hygienic Preparation', text: 'Clean and hygienic preparation.' },
  { image: featureVariety, icon: 'bi-grid-3x3-gap-fill', title: 'Variety', text: 'Juices, shakes, lassi, faluda and ice creams.' },
  { image: featureDelivery, icon: 'bi-bicycle', title: 'Local Delivery', text: 'Online delivery available within 500 meters.' },
];

export const OFFERS = [
  {
    id: 'summer',
    title: 'Summer Special',
    text: 'Beat the Heat with Fresh Mango Juice',
    tag: 'Limited Time',
    theme: 'mango',
    icon: 'bi-brightness-high-fill',
    image: fruitMango,
    cta: { label: 'Order Mango Juice', productName: 'Mango Juice', fallback: '/menu?category=fresh-juices' },
  },
  {
    id: 'combo',
    title: 'Combo Offer',
    text: 'Juice + Ice Cream — the perfect refreshing combo',
    tag: 'Best Value',
    theme: 'combo',
    icon: 'bi-gift-fill',
    image: fruitPineapple,
    cta: { label: 'Grab the Combo', productName: 'Juice + Ice Cream Combo', fallback: '/menu?category=special-items' },
  },
];

/** DEMO reviews — replace with real customer reviews when available. */
export const REVIEWS = [
  { id: 1, name: 'Amit S.', text: 'Fresh juice and great taste!', rating: 5, avatar: avatar1 },
  { id: 2, name: 'Priya R.', text: 'Very good quality and fast service.', rating: 5, avatar: avatar2 },
  { id: 3, name: 'Deepak M.', text: 'Best place for juice and ice cream in Sirpur.', rating: 5, avatar: avatar3 },
];

export const OWNER_AVATARS = [avatar1, avatar2, avatar3];

/** "Popular Products" on the home page (local demo mode). With the backend, tick "Featured" on a product in the admin panel instead. */
export const FEATURED_NAMES = ['Mango Juice', 'Orange Juice', 'Mango Lassi', 'Royal Faluda'];

/* =====================================================================
   REAL PHOTOS (supplied by the shop) — hero slider, banner slider, gallery
   ===================================================================== */
import heroOrange from '../assets/hero/orange-juice.jpg';
import heroMango from '../assets/hero/mango-smoothie.jpg';
import heroWatermelon from '../assets/hero/watermelon.jpg';
import heroFruit from '../assets/hero/fruit-juice.jpg';
import heroFaluda from '../assets/hero/faluda.jpg';

import banNewMenu from '../assets/banners/b01-new-menu.jpg';
import banAssorted from '../assets/banners/b02-assorted-cones.jpg';
import banRainbow from '../assets/banners/b03-rainbow-cones.jpg';
import banPistachio from '../assets/banners/b04-pistachio.jpg';
import banStrawberry from '../assets/banners/b05-strawberry.jpg';
import banCaramel from '../assets/banners/b06-caramel.jpg';
import banStrawberryCone from '../assets/banners/b07-strawberry-cone.jpg';
import banAmul from '../assets/banners/b08-amul.jpg';
import banKudozScoops from '../assets/banners/b09-kudoz-scoops.jpg';
import banKudozCones from '../assets/banners/b10-kudoz-cones.jpg';
import banKudozIndulgence from '../assets/banners/b11-kudoz-indulgence.jpg';

import gal1 from '../assets/gallery/g01-pink-kulfi.jpg';
import gal2 from '../assets/gallery/g02-kesar-kulfi.jpg';
import gal3 from '../assets/gallery/g03-kesar-plate.jpg';
import gal4 from '../assets/gallery/g04-mango-kulfi.jpg';
import gal5 from '../assets/gallery/g05-mango-kulfi-2.jpg';
import gal6 from '../assets/gallery/g06-faluda-pista.jpg';
import gal7 from '../assets/gallery/g07-mango-cups.jpg';
import gal8 from '../assets/gallery/g08-rose-pista.jpg';

/** Hero photo slider (right side of the home banner). productName => links to that product and shows its live price. */
export const HERO_SLIDES = [
  { id: 'orange', image: heroOrange, alt: 'Fresh orange juice with ice and orange slices', productName: 'Orange Juice', to: '/menu?category=fresh-juices' },
  { id: 'mango', image: heroMango, alt: 'Thick mango juice topped with mango cubes', productName: 'Mango Juice', to: '/menu?category=fresh-juices' },
  { id: 'watermelon', image: heroWatermelon, alt: 'Watermelon juice with fresh watermelon pieces', productName: 'Watermelon Juice', to: '/menu?category=fresh-juices' },
  { id: 'fruit', image: heroFruit, alt: 'Fresh fruit juice surrounded by pineapple and orange', label: 'Fresh Fruit Juices', to: '/menu?category=fresh-juices' },
  { id: 'faluda', image: heroFaluda, alt: 'Layered faluda with ice cream, basil seeds and dry fruits', label: 'Royal Faluda', to: '/menu?category=faluda' },
];

/**
 * Ice-cream banner slider. Every banner links to the ice-cream menu.
 * These are banners supplied by the shop; the ones from other brands (Amul, Kudoz)
 * are those brands' own advertisements — keep them only if you have permission to use them.
 * Not shown on purpose (files are in src/assets/banners/_not-used): a banner with a
 * "50% OFF" offer + someone else's website address, and a banner with another brand's logo.
 */
const ICE = '/menu?category=ice-cream';
export const BANNERS = [
  { id: 'new-menu', image: banNewMenu, alt: 'Ice cream scoops with caramel and berry sauce', to: ICE },
  { id: 'assorted', image: banAssorted, alt: 'Assorted ice cream cones with fruits and nuts', to: ICE },
  { id: 'rainbow', image: banRainbow, alt: 'Colourful ice cream cones with sprinkles', to: ICE },
  { id: 'pistachio', image: banPistachio, alt: 'Pistachio ice cream cone', to: ICE },
  { id: 'strawberry', image: banStrawberry, alt: 'Strawberry ice cream cone', to: ICE },
  { id: 'caramel', image: banCaramel, alt: 'Caramel ice cream cone', to: ICE },
  { id: 'strawberry-cone', image: banStrawberryCone, alt: 'Strawberry ice cream cone with fresh strawberries', to: ICE },
  { id: 'amul', image: banAmul, alt: 'Amul ice cream range', to: ICE },
  { id: 'kudoz-scoops', image: banKudozScoops, alt: 'Kudoz ice cream cups', to: ICE },
  { id: 'kudoz-cones', image: banKudozCones, alt: 'Kudoz ice cream cones', to: ICE },
  { id: 'kudoz-indulgence', image: banKudozIndulgence, alt: 'Kudoz ice cream bars and cones', to: ICE },
];

/** Photo gallery with lightbox (click a photo to enlarge). Add/remove entries freely. */
export const GALLERY = [
  { id: 'g1', image: gal7, alt: 'Mango dessert cups with cream and mango cubes' },
  { id: 'g2', image: gal1, alt: 'Pink kulfi sticks on ice' },
  { id: 'g3', image: gal6, alt: 'Faluda glass topped with pistachio ice cream and dry fruits' },
  { id: 'g4', image: gal2, alt: 'Kesar pista kulfi in a bowl' },
  { id: 'g5', image: gal4, alt: 'Mango kulfi on a plate' },
  { id: 'g6', image: gal3, alt: 'Kesar pista kulfi sticks' },
  { id: 'g7', image: gal5, alt: 'Mango kulfi sticks with a cut mango' },
  { id: 'g8', image: gal8, alt: 'Rose and pistachio ice cream scoops' },
];
