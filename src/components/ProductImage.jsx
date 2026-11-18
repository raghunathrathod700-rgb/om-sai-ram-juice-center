/**
 * ProductImage
 * ---------------------------------------------------------------------
 * Renders a small illustrated SVG scene for a product (a glass of juice,
 * a lassi, a milkshake, a faluda, an ice cream scoop, or a combo) tinted
 * with the product's accent color. This replaces flat placeholder boxes
 * with real, distinct artwork for every card on the site, without
 * depending on external photos (so there's no copyright risk and it
 * works fully offline).
 *
 * To use real product photography later, simply swap the products.js
 * `imageType`/`color` fields for an `image` URL field and change
 * ProductCard/ProductDetails to render a plain <img> instead.
 * ---------------------------------------------------------------------
 */

const GlassBase = ({ color }) => (
  <>
    <path
      d="M108 96 L118 210 Q150 222 182 210 L192 96 Z"
      fill="#ffffff"
      opacity="0.55"
      stroke="#ffffff"
      strokeWidth="3"
    />
    <path d="M113 118 L120 205 Q150 216 180 205 L187 118 Q150 130 113 118 Z" fill={color} />
    <ellipse cx="150" cy="117" rx="37" ry="9" fill={color} opacity="0.85" />
    <rect x="132" y="130" width="14" height="14" rx="3" fill="#ffffff" opacity="0.7" transform="rotate(10 139 137)" />
    <rect x="155" y="150" width="12" height="12" rx="3" fill="#ffffff" opacity="0.6" transform="rotate(-8 161 156)" />
    <rect x="158" y="55" width="9" height="110" rx="4" fill="#e63946" transform="rotate(9 162 110)" />
  </>
);

const JuiceGlass = ({ color }) => (
  <g>
    <GlassBase color={color} />
    <path d="M180 100 Q186 92 194 96 Q192 104 184 106 Z" fill="#74c69d" />
  </g>
);

const LassiGlass = ({ color }) => (
  <g>
    <path d="M115 100 L122 208 Q150 220 178 208 L185 100 Z" fill="#fff8e7" stroke="#ffffff" strokeWidth="3" />
    <path d="M119 100 Q150 116 181 100 L178 208 Q150 220 122 208 Z" fill="#fff8e7" />
    <ellipse cx="150" cy="100" rx="33" ry="8" fill={color} opacity="0.9" />
    <circle cx="138" cy="98" r="4" fill={color} opacity="0.7" />
    <circle cx="162" cy="96" r="3.5" fill={color} opacity="0.7" />
    <circle cx="150" cy="102" r="3" fill={color} opacity="0.7" />
  </g>
);

const ShakeGlass = ({ color }) => (
  <g>
    <path d="M118 108 L126 205 Q150 216 174 205 L182 108 Z" fill={color} stroke="#ffffff" strokeWidth="3" />
    <path d="M110 92 Q150 78 190 92 Q182 106 150 108 Q118 106 110 92 Z" fill="#ffffff" opacity="0.92" />
    <circle cx="150" cy="82" r="7" fill="#e63946" />
    <rect x="156" y="50" width="9" height="100" rx="4" fill="#e63946" transform="rotate(8 160 100)" />
  </g>
);

const FaludaGlass = ({ color }) => (
  <g>
    <path d="M120 90 L128 208 Q150 218 172 208 L180 90 Z" fill="#fff3e0" stroke="#ffffff" strokeWidth="3" />
    <path d="M124 130 L131 208 Q150 216 169 208 L176 130 Z" fill={color} opacity="0.55" />
    <path d="M126 160 L132 208 Q150 214 168 208 L174 160 Z" fill={color} opacity="0.8" />
    <g stroke="#ffffff" strokeWidth="2" opacity="0.8" fill="none">
      <path d="M132 140 Q140 160 132 190" />
      <path d="M150 135 Q158 160 150 195" />
      <path d="M168 140 Q160 160 168 190" />
    </g>
    <circle cx="150" cy="86" r="16" fill={color} />
    <circle cx="150" cy="78" r="5" fill="#e63946" />
  </g>
);

const IceCreamCup = ({ color }) => (
  <g>
    <path d="M128 130 L172 130 L163 205 Q150 214 137 205 Z" fill="#e9a319" opacity="0.85" />
    <circle cx="150" cy="118" r="34" fill={color} />
    <circle cx="138" cy="105" r="10" fill="#ffffff" opacity="0.35" />
    <path d="M150 90 Q158 78 168 84" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.7" />
    <circle cx="150" cy="88" r="6" fill="#e63946" />
  </g>
);

const ComboScene = ({ color }) => (
  <g>
    <g transform="translate(-38 12) scale(0.72)">
      <GlassBase color={color} />
    </g>
    <g transform="translate(48 -8) scale(0.6)">
      <path d="M128 130 L172 130 L163 205 Q150 214 137 205 Z" fill="#e9a319" opacity="0.85" />
      <circle cx="150" cy="118" r="34" fill={color} />
      <circle cx="150" cy="88" r="6" fill="#e63946" />
    </g>
  </g>
);

const RENDERERS = {
  juice: JuiceGlass,
  lassi: LassiGlass,
  shake: ShakeGlass,
  faluda: FaludaGlass,
  icecream: IceCreamCup,
  combo: ComboScene,
};

const ProductImage = ({ type = 'juice', color = '#ff8c00', className = '', title }) => {
  const Illustration = RENDERERS[type] || JuiceGlass;

  return (
    <svg
      viewBox="0 0 300 300"
      className={className}
      role="img"
      aria-label={title ? `${title} illustration` : 'Product illustration'}
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="300" height="300" fill="#fffaf0" />
      <circle cx="150" cy="150" r="132" fill={color} opacity="0.14" />
      <circle cx="150" cy="150" r="98" fill={color} opacity="0.1" />
      <Illustration color={color} />
    </svg>
  );
};

export default ProductImage;
