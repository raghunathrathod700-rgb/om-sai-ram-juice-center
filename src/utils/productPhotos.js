/**
 * Auto-detects REAL photos dropped into the assets folders (Vite import.meta.glob).
 *  - Product photo:  src/assets/products/<product-name-slug>.jpg|png|webp|avif
 *  - Hero photo:     src/assets/hero-photo.jpg|png|webp|avif
 *  - Shop photo:    src/assets/shop-photo.jpg|png|webp|avif
 *  - UPI QR image:   src/assets/payment/phonepe-qr.png|jpg|jpeg|webp
 * Nothing breaks when a file is missing: the app falls back to its illustrations.
 */
const productPhotoModules = import.meta.glob('../assets/products/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
});
const heroPhotoModules = import.meta.glob('../assets/hero-photo.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
});
const shopPhotoModules = import.meta.glob('../assets/shop-photo.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
});
const qrModules = import.meta.glob('../assets/payment/phonepe-qr.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
});

export const slugify = (str = '') =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const getProductPhoto = (name) => {
  const slug = slugify(name);
  for (const path of Object.keys(productPhotoModules)) {
    const filename = path.split('/').pop().replace(/\.[^.]+$/, '');
    if (filename === slug) return productPhotoModules[path];
  }
  return null;
};

export const getHeroPhoto = () => Object.values(heroPhotoModules)[0] || null;
export const getShopPhoto = () => Object.values(shopPhotoModules)[0] || null;
export const getUpiQrImage = () => Object.values(qrModules)[0] || null;
