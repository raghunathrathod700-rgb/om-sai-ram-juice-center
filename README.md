# Om Sai Ram Juice Center — Website + Backend

React (Vite, Bootstrap 5) website **and** a Spring Boot + MySQL backend with an admin panel.
Sirpur, Burhanpur, Madhya Pradesh · delivery only within **500 m** of the shop.

```
om-sai-ram-juice-center/
├── src/ …        React website
├── backend/      Spring Boot 3 + MySQL API (menu, prices, accounts, orders, payments, admin)
└── README.md
```

## 1. Two ways to run

| Mode | When | What you get |
|---|---|---|
| **Local demo** | `VITE_API_BASE_URL` empty | Everything stays inside the browser (no server needed). Good for a quick look. |
| **Real shop** | `VITE_API_BASE_URL=http://localhost:8080` | Menu + prices from MySQL, real customer accounts, real orders, Razorpay verification and the **/admin** panel. |

## 2. Run the website
```bash
npm install
npm run dev        # http://localhost:5173
```
Node 18+. Copy `.env.example` to `.env` to change settings.

## 3. Run the backend (needed for the admin panel)
Requirements: Java 17+, Maven, MySQL 8 (`docker compose up -d` inside `backend/` starts one).
```bash
cd backend
# set the variables (PowerShell shown; on Linux/macOS use export):
$env:DB_USER="root"; $env:DB_PASSWORD="change-me"
$env:JWT_SECRET="put-a-long-random-secret-of-32+-characters"
$env:ADMIN_EMAIL="owner@example.com"; $env:ADMIN_PASSWORD="ChangeMe123"
mvn spring-boot:run          # http://localhost:8080
```
First start: the database and tables are created, the 30-item starting menu is inserted (sample prices) and the admin account is created. Full variable list: `backend/README.md`.

Then in the website's `.env` put `VITE_API_BASE_URL=http://localhost:8080` and restart `npm run dev`.

## 4. Using the admin panel
Log in with `ADMIN_EMAIL` / `ADMIN_PASSWORD` on the normal Login page → an **Admin** button appears (or open `/admin`).

* **Dashboard** — orders today, sales today, new orders, payments waiting for verification, latest orders.
* **Orders** — every customer order with name, phone/WhatsApp, address, items and payment. Change the **order status** (Preparing → Ready → Out for Delivery → Delivered / Cancelled) and the **payment status** (e.g. mark a UPI/QR payment **Paid** after you see it in PhonePe). The list refreshes by itself every 30 s.
* **Menu & Prices** — change a price right in the table (type, press Enter or **Save**), switch an item **Available / Sold Out**, mark it **Popular** (home page), **Add new item** (name, category, price, description, photo upload) and **Edit / Delete**. Changes show on the website immediately.
* **Categories** — add a new category (e.g. "Cold Coffee") or delete an empty one.

## 5. Payments
Checkout offers **Cash on Delivery**, **UPI / PhonePe QR** and **Online Payment (Razorpay)**.

* **UPI / PhonePe QR** — the customer scans your QR and enters the UTR number; the order is saved as **"Awaiting verification"** and is **never marked paid automatically**. You verify it in the admin panel.
* **Razorpay** — the *server* creates the payment order, the customer pays in Razorpay's window and the server verifies the signature before the order shows **Paid**. A cancelled payment can be retried from "My Orders". Set `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` on the backend (never in the website). Without them the Online option is shown as unavailable.
* Put your PhonePe QR at `src/assets/payment/phonepe-qr.png` and your UPI id in `src/config/shop.js`.

## 6. Other settings & photos
| What | Where |
|---|---|
| Shop name, owners/phones, delivery radius, UPI id, opening hours, social links | `src/config/shop.js` |
| Offers, reviews (sample), hero / banner / gallery photos | `src/data/siteContent.js` |
| Menu & prices | **Admin panel** (backend mode). In local demo mode: `src/data/products.js` |
| Item photos | Upload in the admin panel. Photos bundled with the site (`src/assets/products/<name>.jpg`) are used for items that have no uploaded photo. |
| Delivery fee, 500 m radius, shop GPS | `backend/src/main/resources/application.properties` |

## 7. Delivery rule (500 m)
Shown on Home, Menu, Cart, Checkout, Delivery page and Footer. Without shop GPS coordinates the check is a **demo estimate** (clearly labelled). Put the shop's `shop.latitude` / `shop.longitude` in the backend (and `coordinates` in `src/config/shop.js`) to measure the real distance — the server then refuses delivery orders from outside the radius. Customers outside the zone can choose **Self Pickup**.

## 8. Honest status
* The frontend was tested by rendering every page and running its API code against a simulated backend. The backend's Java code was syntax-checked with the Java compiler, but it could **not** be built or run in the environment where it was written (no Maven / MySQL there) — on the first `mvn spring-boot:run` a small fix may be needed; send the error text and it can be fixed quickly.
* Not included yet (add before a big public launch): rate-limiting on login, e-mail/SMS OTP password reset (the site tells customers to call the shop), Razorpay webhooks, HTTPS (use a reverse proxy), automated backend tests.
* Reviews on the home page are sample reviews; the Amul/Kudoz banners are those brands' own ads — keep them only with permission.
