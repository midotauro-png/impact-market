# Bahrain Marketplace 🇧🇭

Full multi-vendor marketplace + zone-based delivery platform for Bahrain.

## Tech Stack
- **Next.js 14** (App Router, TypeScript)
- **Supabase** (Postgres, Auth, RLS)
- **Tap Payments** (Bahrain/GCC payment gateway)
- **Tailwind CSS** + Lucide icons
- **Zustand** (cart state, persisted)

---

## Getting Started

```bash
cd bahrain-marketplace
cp .env.example .env.local   # add your keys
npm install
npm run dev                  # http://localhost:3000
```

### Environment Variables (`.env.local`)
| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (API routes) |
| `TAP_SECRET_KEY` | Tap Payments secret key (`sk_test_…`) |
| `TAP_WEBHOOK_SECRET` | Tap webhook HMAC secret |
| `NEXT_PUBLIC_SITE_URL` | Your deployed URL (for Tap redirects) |

> **Demo mode:** The app works fully without any env vars using mock data.

---

## Routes

### Customer
| Path | Description |
|---|---|
| `/` | Landing page with zone pills, featured stores |
| `/stores` | All vendors with zone + category filters |
| `/store/[id]` | Vendor menu + add to cart |
| `/cart` | Cart with live delivery fee calculation |
| `/checkout` | Address + payment method + order placement |
| `/orders` | Order history |
| `/orders/[code]` | Live order status timeline |

### Admin (`/admin`)
| Path | Description |
|---|---|
| `/admin` | GMV, profit, pending approvals |
| `/admin/zones` | SVG zone map, zone CRUD |
| `/admin/orders` | All orders with financial breakdown |
| `/admin/vendors` | Approve / suspend vendors |
| `/admin/drivers` | Approve / suspend drivers |
| `/admin/delivery` | Live delivery tracker |
| `/admin/payouts` | Vendor & driver payout management |
| `/admin/commissions` | Per-category commission editor |
| `/admin/reports` | P&L, zone breakdown, top vendors |
| `/admin/categories` | Category CRUD |
| `/admin/settings` | Platform fees, delivery fees, pause |

### Vendor (`/vendor`)
| Path | Description |
|---|---|
| `/vendor` | Dashboard overview |
| `/vendor/products` | Product CRUD |
| `/vendor/orders` | Order inbox + status advancement |
| `/vendor/earnings` | Revenue, commissions, payouts |
| `/vendor/reviews` | Customer reviews |
| `/vendor/signup` | 3-step vendor registration |

### Driver (`/driver`)
| Path | Description |
|---|---|
| `/driver` | Online toggle + active deliveries |
| `/driver/delivery` | Turn-by-turn active delivery screen |
| `/driver/earnings` | Wallet, payout history |
| `/driver/history` | All past deliveries |
| `/driver/signup` | Driver registration |

### API Routes
| Endpoint | Description |
|---|---|
| `POST /api/checkout` | Create order + Tap charge |
| `GET /api/zones?lat=&lng=` | Detect zone from coordinates |
| `GET /api/vendors?zone=&category=` | Ranked vendor list |
| `GET /api/orders?vendor=` | Orders by party |
| `GET /api/driver?zone=&lat=&lng=` | Nearest available driver |
| `POST /api/tap/webhook` | Tap payment webhook |

---

## Zone System

15 Bahrain zones with polygon boundaries, centroid coordinates, and zone-to-zone delivery fee calculation:

- **Same zone:** 1.000 BHD
- **Nearby (< 5 km):** 1.500 BHD  
- **Mid (5–10 km):** 2.000 BHD
- **Far (> 10 km):** 3.000 BHD

Zone detection uses ray-casting point-in-polygon algorithm. Vendor ranking scores: zone match (40pts) + distance (20pts) + rating (15pts) + delivery time (10pts) + open now (10pts) + featured (5pts).

## Database Schema

Run `supabase/migrations/001_schema.sql` in your Supabase SQL editor. Includes:
- `zones`, `vendor_categories`, `vendors`, `products`
- `orders`, `drivers`, `vendor_payouts`, `driver_payouts`
- `reviews`, `promo_codes`, `profiles`
- Full RLS policies for all roles

## Financial Model (per order)

```
Customer pays:   Subtotal + Delivery Fee + Service Fee
Vendor receives: Subtotal − Commission (%)
Driver receives: Fixed payout (default 1.000 BHD)
Admin profit:    Commission + Service Fee + (Delivery − Driver Payout)
```
