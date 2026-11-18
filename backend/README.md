# Om Sai Ram Juice Center — Backend (Spring Boot 3 + MySQL)

REST API for the website: menu (products / categories / prices), customer accounts, orders, Razorpay payments and the **admin panel** (add items, change prices, upload photos, manage orders).

## 1. Requirements
* Java 17+ and Maven 3.9+
* MySQL 8 (running locally or hosted)

## 2. Configure (environment variables)

No MySQL yet? `docker compose up -d` in this folder starts one (root password `change-me`, then use `DB_PASSWORD=change-me`).


| Variable | Meaning | Example |
|---|---|---|
| `DB_USER` / `DB_PASSWORD` | MySQL login | `root` / `secret` |
| `DB_HOST` `DB_PORT` `DB_NAME` | optional, default `localhost` `3306` `osrjc` (database is created automatically) | |
| `JWT_SECRET` | **required**, ≥ 32 random characters | `openssl rand -hex 32` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | first admin account (password ≥ 8 chars), created on first start | `owner@example.com` |
| `CORS_ORIGINS` | website address(es), comma separated | `http://localhost:5173` |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | optional — enables "Online Payment" | `rzp_test_…` |
| `shop.latitude` / `shop.longitude` (uncomment in `application.properties`) | optional — makes the server enforce the 500 m rule using the customer's GPS | |

Windows PowerShell example:
```powershell
$env:DB_USER="root"; $env:DB_PASSWORD="yourpassword"
$env:JWT_SECRET="put-a-long-random-secret-of-32+-characters"
$env:ADMIN_EMAIL="owner@example.com"; $env:ADMIN_PASSWORD="ChangeMe123"
mvn spring-boot:run
```
Linux / macOS: `export DB_USER=root DB_PASSWORD=... JWT_SECRET=... ADMIN_EMAIL=... ADMIN_PASSWORD=...` then `mvn spring-boot:run`.

On the first start the tables are created, the starting menu (30 items, **sample prices**) is inserted and the admin account is created. API runs on `http://localhost:8080`.

## 3. Connect the website
In the website's root `.env` set `VITE_API_BASE_URL=http://localhost:8080` and restart `npm run dev`. Log in with the admin e-mail → an **Admin** link appears in the menu (`/admin`).

## 4. API summary
Public: `GET /api/products`, `/api/categories`, `POST /api/auth/register|login`, `GET /api/payments/config`  
Customer (Bearer token): `GET|PUT /api/auth/me`, `POST /api/orders`, `GET /api/orders/mine`, `POST /api/orders/{id}/pay`, `POST /api/payments/verify`  
Admin: `GET /api/admin/stats|orders`, `PUT /api/admin/orders/{id}/status|payment`, `POST|PUT|DELETE /api/admin/products[/{id}]`, `POST|DELETE /api/admin/products/{id}/image`, `POST|PUT|DELETE /api/admin/categories[/{id}]`

## 5. Security notes
* Passwords are BCrypt-hashed; login returns a signed JWT; `/api/admin/**` needs the ADMIN role; nobody can become admin through the public API.
* Prices are always read from the database — the browser cannot change them.
* Payment signatures are verified on the server (HMAC-SHA256). Razorpay keys live only in environment variables.
* Photo uploads accept only real JPEG / PNG / WebP files (checked by content), max 5 MB.
* Not included yet (add before a large public launch): rate limiting on login, e-mail/SMS OTP password reset, Razorpay webhooks, HTTPS (use a reverse proxy), automated tests.
