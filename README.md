<div align="center">

# 🥭 Om Sai Ram Juice Center

**Freshness in Every Sip!** — an online ordering website with an admin panel for a local juice, lassi, faluda & ice-cream shop in Sirpur, Burhanpur (M.P.), India.
---

## 📑 Table of Contents
- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Configuration](#-configuration)
- [Admin Panel](#-admin-panel)
- [Payments](#-payments)
- [Delivery Rule (500 m)](#-delivery-rule-500-m)
- [REST API](#-rest-api)
- [Security](#-security)
- [Customising Content & Photos](#-customising-content--photos)
- [Roadmap](#-roadmap)
- [Author](#-author)
- [License](#-license)

---

## 🌟 About

Om Sai Ram Juice Center serves fresh juices, lassi, badam shake, faluda and ice creams in **Sirpur, Burhanpur, Madhya Pradesh**.
This project is the shop's complete web presence:

* a fast, mobile-first **customer website** (menu, cart, checkout, order tracking), and
* a **Spring Boot + MySQL backend** with an **admin panel** where the owner can add new items, change prices, upload photos and manage orders — no code changes needed.

> **Business rule:** online delivery is available **only within 500 meters** of the shop. It is shown on the Home, Menu, Cart, Checkout, Delivery page and Footer, and customers outside the zone can choose **Self Pickup**.

The site can run in two modes:

| Mode | When | What you get |
|---|---|---|
| **Local demo** | `VITE_API_BASE_URL` is empty | Everything stays in the browser. No server needed — good for a quick look. |
| **Real shop** | `VITE_API_BASE_URL=http://localhost:8080` | Menu & prices from MySQL, real accounts and orders, verified payments and the `/admin` panel. |

---

## ✨ Features

### Customers
- 🏠 Premium responsive home page: animated hero photo slider, ice-cream banner slider, popular products, brand filter, reviews, about, map and contact
- 🔎 Menu with debounced search, category chips, ice-cream **brand filter**, sorting and **favourites** (all filters live in the URL, so any view can be shared)
- 🛒 Cart with mini-drawer, quantity controls, live totals and a **"fly to cart"** animation
- 🧾 Checkout with **Home Delivery / Self Pickup**, form validation and delivery-area check
- 📦 **My Orders** with a status timeline, "Order again" and "Pay now" for unpaid online orders
- 👤 Register / login / profile (JWT sessions, "Remember me")
- 📱 Mobile-first design (320 px → 1920 px): bottom navigation, navigation drawer, touch-friendly buttons
- ♿ Accessible: semantic HTML, labels, keyboard navigation, skip-link, `prefers-reduced-motion` respected
- 🖼️ Photo gallery with lightbox, scroll-reveal animations, scroll-progress bar and back-to-top button

### Shop owner (Admin panel)
- 📊 **Dashboard** — orders today, sales today, new orders, payments waiting for verification
- 🧾 **Orders** — customer details, WhatsApp / call links, change order status & payment status (auto-refreshes every 30 s)
- 🍹 **Menu & Prices** — change a price inline, mark items *Sold Out*, mark items *Popular*, **add / edit / delete items**, upload photos
- 🏷️ **Categories** — add or remove categories
- Changes appear on the website **immediately**

### Payments
- 💵 Cash on Delivery
- 📲 UPI / PhonePe QR — saved as **"Awaiting verification"**, verified manually by the shop (never auto-marked paid)
- 💳 Online payment with **Razorpay** — order created and **signature verified on the server**

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router 6, React Bootstrap / Bootstrap 5, Bootstrap Icons, plain CSS3 |
| React concepts | Context + `useReducer`, custom hooks, `useSyncExternalStore`, lazy routes + `Suspense`, `ErrorBoundary`, `React.memo` |
| Backend | Java 17, Spring Boot 3 (Web, Data JPA, Security, Validation) |
| Database | MySQL 8 |
| Auth | JWT (jjwt), BCrypt password hashing, role-based access (`CUSTOMER`, `ADMIN`) |
| Payments | Razorpay Orders API + HMAC-SHA256 signature verification |

---

## 🖼️ Screenshots

> Add your own screenshots to `docs/screenshots/` and link them here:
>
> | Home | Menu | Admin – Menu & Prices |
> |---|---|---|
> | `docs/screenshots/home.png` | `docs/screenshots/menu.png` | `docs/screenshots/admin-products.png` |

---

## 🗂️ Project Structure

```
om-sai-ram-juice-center/
├── src/                          # React website
│   ├── components/               # Navbar, ProductCard, CartDrawer, HeroGallery, BannerSlider ...
│   │   └── admin/                # AdminDashboard, AdminOrders, AdminProducts, AdminCategories
│   ├── pages/                    # Home, Menu, ProductDetails, Cart, Checkout, Orders, Profile, Admin ...
│   ├── context/                  # Auth, Cart, Favourites, Toast
│   ├── hooks/                    # useProducts, useCarousel, useDebounce ...
│   ├── services/                 # http, auth, orders, payments, catalogue store, admin API
│   ├── config/shop.js            # shop name, phones, delivery radius, UPI id ...
│   ├── data/                     # starting menu (demo mode) and marketing content
│   └── assets/                   # product photos, hero, banners, gallery, illustrations
├── backend/                      # Spring Boot API
│   └── src/main/java/com/omsairam/juice/
│       ├── config/  security/    # CORS, Spring Security, JWT filter
│       ├── model/   repo/        # JPA entities and repositories
│       ├── dto/     service/     # request/response records, business logic
│       ├── web/                  # REST controllers + error handling
│       └── seed/                 # first-start menu + admin account
├── .env.example
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Java 17+ and Maven 3.9+
- MySQL 8 (or `docker compose up -d` inside `backend/`)

### 1. Clone
```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

### 2. Start the backend
```bash
cd backend

# PowerShell (Windows)
$env:DB_USER="root"; $env:DB_PASSWORD="your-mysql-password"
$env:JWT_SECRET="a-long-random-secret-of-at-least-32-characters"
$env:ADMIN_EMAIL="owner@example.com"; $env:ADMIN_PASSWORD="ChangeMe123"

# Linux / macOS
# export DB_USER=root DB_PASSWORD=... JWT_SECRET=... ADMIN_EMAIL=... ADMIN_PASSWORD=...

mvn spring-boot:run          # http://localhost:8080
```
On the first start the database and tables are created, the starting menu (30 items with **sample prices**) is inserted and the admin account is created.

### 3. Start the website
```bash
cd ..                        # project root
cp .env.example .env         # set VITE_API_BASE_URL=http://localhost:8080
npm install
npm run dev                  # http://localhost:5173
```
> No backend? Leave `VITE_API_BASE_URL` empty to run the **local demo mode**.

### 4. First login
Open the site → **Login** with `ADMIN_EMAIL` / `ADMIN_PASSWORD` → an **Admin** button appears (or open `/admin`).

---

## ⚙️ Configuration

### Backend (environment variables)

| Variable | Required | Meaning |
|---|---|---|
| `DB_USER`, `DB_PASSWORD` | ✅ | MySQL login (`DB_HOST`, `DB_PORT`, `DB_NAME` optional; database `osrjc` is auto-created) |
| `JWT_SECRET` | ✅ | At least 32 random characters |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | ✅ first run | First admin account (password ≥ 8 characters) |
| `CORS_ORIGINS` | – | Website address(es), default `http://localhost:5173` |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | – | Enables Online Payment |
| `DELIVERY_FEE`, `DELIVERY_RADIUS_METERS` | – | Defaults `0` and `500` |
| `shop.latitude`, `shop.longitude` | – | In `application.properties`; lets the server enforce the 500 m rule using GPS |

### Frontend (`.env`)

| Variable | Meaning |
|---|---|
| `VITE_API_BASE_URL` | Backend address. Empty = local demo mode |
| `VITE_RAZORPAY_KEY_ID` | Local demo mode only (test popup). With the backend the key lives on the server |

Shop details (name, owners, delivery radius, UPI id, opening hours, social links) are in `src/config/shop.js`.

---

## 🛠️ Admin Panel

Available at **`/admin`** for users with the `ADMIN` role.

| Tab | What you can do |
|---|---|
| **Dashboard** | Today's orders & sales, new orders, payments waiting for verification, latest orders |
| **Orders** | See customer, address, items and payment; update **order status** (Preparing → Ready → Out for Delivery → Delivered / Cancelled) and **payment status** |
| **Menu & Prices** | Edit prices inline, toggle *Available* / *Popular*, **add new items**, edit, delete, upload photos (JPG / PNG / WebP, max 5 MB) |
| **Categories** | Add a category or delete an empty one |

---

## 💳 Payments

| Method | How it works |
|---|---|
| **Cash on Delivery** | Order saved as *Pay on delivery* |
| **UPI / PhonePe QR** | Customer scans the shop QR and enters the UTR number. Saved as *Awaiting verification*; the admin marks it **Paid** after checking the PhonePe app |
| **Razorpay** | Server creates the order → customer pays → server verifies the HMAC signature → order becomes **Paid**. A cancelled payment can be retried from *My Orders* |

Put the PhonePe QR image at `src/assets/payment/phonepe-qr.png` and the UPI id in `src/config/shop.js`.

---

## 📍 Delivery Rule (500 m)

Online delivery is available **only within 500 meters** of the shop.

* Without shop GPS coordinates the website shows a clearly-labelled **demo estimate**.
* With `shop.latitude` / `shop.longitude` configured, the **Haversine distance** is measured from the customer's location and the server rejects delivery orders outside the radius.
* Outside the zone, customers can still order for **Self Pickup**.

---

## 🔌 REST API

**Public**

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products`, `/api/products/{id}` | Menu |
| GET | `/api/categories` | Categories |
| POST | `/api/auth/register`, `/api/auth/login` | Create account / login (returns JWT) |
| GET | `/api/payments/config` | Is online payment enabled? |

**Customer** *(Bearer token)*

| Method | Endpoint | Description |
|---|---|---|
| GET, PUT | `/api/auth/me` | Profile |
| POST | `/api/orders` | Place an order (server calculates prices) |
| GET | `/api/orders/mine` | My orders |
| POST | `/api/orders/{id}/pay` | Retry an online payment |
| POST | `/api/payments/verify` | Verify a Razorpay payment |

**Admin** *(role `ADMIN`)*

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/stats` | Dashboard numbers |
| GET | `/api/admin/orders?status=` | All orders |
| PUT | `/api/admin/orders/{id}/status`, `/payment` | Update order / payment status |
| POST, PUT, DELETE | `/api/admin/products[/{id}]` | Add / edit / delete items |
| POST, DELETE | `/api/admin/products/{id}/image` | Upload / remove a photo |
| POST, PUT, DELETE | `/api/admin/categories[/{id}]` | Manage categories |

---

## 🔒 Security

- Passwords are hashed with **BCrypt**; sessions use signed **JWT**; `/api/admin/**` requires the `ADMIN` role; nobody can become admin through the public API.
- **Prices are always read from the database** — the browser only sends product ids and quantities.
- Razorpay signatures are verified on the server (HMAC-SHA256); secret keys live only in environment variables.
- Photo uploads accept only real JPEG / PNG / WebP files (checked by content) up to 5 MB.
- Input is validated on both client and server.

---

## 🎨 Customising Content & Photos

| What | Where |
|---|---|
| Menu & prices | Admin panel (backend mode) or `src/data/products.js` (demo mode) |
| Item photos | Upload in the admin panel, or add `src/assets/products/<item-name>.jpg` |
| Hero slider, banners, gallery, offers, sample reviews | `src/data/siteContent.js` |
| Shop details, UPI id, opening hours, social links | `src/config/shop.js` |

---

## 🗺️ Roadmap

- [ ] E-mail / SMS OTP for password reset
- [ ] Razorpay webhooks
- [ ] Rate limiting on login
- [ ] Automated backend tests
- [ ] Real customer reviews
- [ ] Kulfi items in the menu
- [ ] HTTPS / production deployment guide

---

## 👨‍💻 Author

**Raghunath Rathod** — Java Full-Stack Developer, Burhanpur, Madhya Pradesh
GitHub: [`@your-username`](https://github.com/your-username)

📍 Om Sai Ram Juice Center, Sirpur, Burhanpur, Madhya Pradesh, India

---

## 📄 License

© 2026 Om Sai Ram Juice Center. All rights reserved.
Some banner images are advertisements of third-party brands and remain the property of their owners.
