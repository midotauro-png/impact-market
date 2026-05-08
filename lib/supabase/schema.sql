-- ============================================================
-- Impact Market Bahrain — Supabase Database Schema
-- Currency: BHD stored as integer fils (1 BHD = 1000 fils)
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ─── Enums ────────────────────────────────────────────────────────────────────

create type user_role          as enum ('customer','vendor','driver','admin');
create type approval_status    as enum ('pending','approved','rejected','suspended');
create type subscription_plan  as enum ('free','growth','premium');
create type order_status       as enum (
  'pending_payment','paid','sent_to_vendor','vendor_accepted',
  'vendor_preparing','driver_assigned','driver_picked_up',
  'on_the_way','delivered','cancelled','refunded'
);
create type payment_method     as enum ('online','cash_on_delivery');
create type payment_status     as enum ('pending','paid','failed','refunded');
create type payout_status      as enum ('pending','paid');
create type vehicle_type       as enum ('bike','car','scooter');
create type surcharge_type     as enum ('none','rush','rain');

-- ─── users ────────────────────────────────────────────────────────────────────

create table users (
  id          uuid primary key default gen_random_uuid(),
  email       text unique not null,
  phone       text,
  full_name   text not null,
  role        user_role not null default 'customer',
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ─── delivery_zones ───────────────────────────────────────────────────────────

create table delivery_zones (
  id                       text primary key,            -- e.g. "z-manama"
  name                     text not null,
  slug                     text unique not null,
  cities                   text[] not null default '{}',
  group_id                 text,                        -- e.g. "g1"
  group_name               text,
  centroid_lat             numeric(10,7) not null,
  centroid_lng             numeric(10,7) not null,
  base_delivery_fee_fils   int not null default 700,
  min_order_fils           int not null default 2500,
  estimated_delivery_min   int not null default 30,
  is_active                boolean not null default true,
  created_at               timestamptz not null default now()
);

-- ─── vendor_categories ────────────────────────────────────────────────────────

create table vendor_categories (
  id              text primary key,
  slug            text unique not null,
  name            text not null,
  icon            text not null default '🛍️',
  commission_pct  numeric(5,2) not null default 12,
  created_at      timestamptz not null default now()
);

-- ─── vendors ──────────────────────────────────────────────────────────────────

create table vendors (
  id                       uuid primary key default gen_random_uuid(),
  user_id                  uuid not null references users(id) on delete cascade,
  business_name            text not null,
  owner_name               text not null,
  phone                    text not null,
  email                    text not null,
  cr_number                text,
  category_id              text not null references vendor_categories(id),
  address                  text not null,
  lat                      numeric(10,7) not null,
  lng                      numeric(10,7) not null,
  zone_id                  text not null references delivery_zones(id),
  delivery_radius_km       numeric(5,1) not null default 5,
  logo_url                 text,
  cover_url                text,
  opening_hours            jsonb not null default '{"open":"08:00","close":"22:00","days":[0,1,2,3,4,5,6]}',
  status                   approval_status not null default 'pending',
  subscription_plan        subscription_plan not null default 'free',
  commission_pct           numeric(5,2) not null default 15,
  preparation_time_minutes int not null default 20,
  is_featured              boolean not null default false,
  is_premium               boolean not null default false,
  is_open                  boolean not null default false,
  rating                   numeric(3,2) not null default 0,
  total_orders             int not null default 0,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

-- ─── seller_subscriptions ─────────────────────────────────────────────────────

create table seller_subscriptions (
  id              uuid primary key default gen_random_uuid(),
  vendor_id       uuid not null references vendors(id) on delete cascade,
  plan            subscription_plan not null,
  monthly_fee_fils int not null default 0,
  starts_at       timestamptz not null default now(),
  ends_at         timestamptz,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now()
);

-- ─── products ─────────────────────────────────────────────────────────────────

create table products (
  id           uuid primary key default gen_random_uuid(),
  vendor_id    uuid not null references vendors(id) on delete cascade,
  category_id  text not null references vendor_categories(id),
  name         text not null,
  description  text not null default '',
  price_fils   int not null,
  stock        int not null default 0,
  images       text[] not null default '{}',
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ─── drivers ──────────────────────────────────────────────────────────────────

create table drivers (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references users(id) on delete cascade,
  full_name            text not null,
  phone                text not null,
  email                text not null,
  cpr                  text unique not null,
  vehicle_type         vehicle_type not null,
  vehicle_plate        text not null,
  lat                  numeric(10,7),
  lng                  numeric(10,7),
  active_zone_id       text references delivery_zones(id),
  preferred_zone_ids   text[] not null default '{}',
  is_online            boolean not null default false,
  status               approval_status not null default 'pending',
  rating               numeric(3,2) not null default 0,
  total_deliveries     int not null default 0,
  wallet_fils          int not null default 0,
  created_at           timestamptz not null default now()
);

-- ─── orders ───────────────────────────────────────────────────────────────────

create table orders (
  id                         uuid primary key default gen_random_uuid(),
  short_code                 text unique not null,
  customer_id                uuid not null references users(id),
  vendor_id                  uuid not null references vendors(id),
  driver_id                  uuid references drivers(id),
  customer_zone_id           text not null references delivery_zones(id),
  vendor_zone_id             text not null references delivery_zones(id),
  delivery_address           text not null,
  delivery_lat               numeric(10,7) not null,
  delivery_lng               numeric(10,7) not null,
  subtotal_fils              int not null,
  delivery_fee_fils          int not null default 0,
  service_fee_fils           int not null default 300,
  surcharge_type             surcharge_type not null default 'none',
  surcharge_fils             int not null default 0,
  commission_fils            int not null,
  driver_payout_fils         int not null,
  vendor_delivery_share_fils int not null default 0,
  admin_profit_fils          int not null,
  vendor_net_fils            int not null,
  total_fils                 int not null,
  payment_method             payment_method not null,
  payment_status             payment_status not null default 'pending',
  status                     order_status not null default 'pending_payment',
  tap_charge_id              text,
  distance_km                numeric(5,2),
  is_free_delivery           boolean not null default false,
  created_at                 timestamptz not null default now(),
  updated_at                 timestamptz not null default now()
);

-- ─── order_items ──────────────────────────────────────────────────────────────

create table order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references orders(id) on delete cascade,
  product_id  uuid not null references products(id),
  name        text not null,
  quantity    int not null default 1,
  price_fils  int not null,
  image_url   text,
  created_at  timestamptz not null default now()
);

-- ─── payments ─────────────────────────────────────────────────────────────────

create table payments (
  id              uuid primary key default gen_random_uuid(),
  order_id        uuid not null references orders(id),
  amount_fils     int not null,
  method          payment_method not null,
  status          payment_status not null default 'pending',
  tap_charge_id   text,
  tap_response    jsonb,
  created_at      timestamptz not null default now()
);

-- ─── vendor_payouts ───────────────────────────────────────────────────────────

create table vendor_payouts (
  id            uuid primary key default gen_random_uuid(),
  vendor_id     uuid not null references vendors(id),
  order_id      uuid not null references orders(id),
  gross_fils    int not null,
  commission_fils int not null,
  net_fils      int not null,
  status        payout_status not null default 'pending',
  created_at    timestamptz not null default now()
);

-- ─── driver_payouts ───────────────────────────────────────────────────────────

create table driver_payouts (
  id            uuid primary key default gen_random_uuid(),
  driver_id     uuid not null references drivers(id),
  order_id      uuid not null references orders(id),
  base_fils     int not null,
  bonus_fils    int not null default 0,
  surcharge_fils int not null default 0,
  total_fils    int not null,
  status        payout_status not null default 'pending',
  created_at    timestamptz not null default now()
);

-- ─── driver_locations (live GPS) ──────────────────────────────────────────────

create table driver_locations (
  driver_id   uuid primary key references drivers(id) on delete cascade,
  lat         numeric(10,7) not null,
  lng         numeric(10,7) not null,
  zone_id     text references delivery_zones(id),
  updated_at  timestamptz not null default now()
);

-- ─── reviews ──────────────────────────────────────────────────────────────────

create table reviews (
  id              uuid primary key default gen_random_uuid(),
  order_id        uuid not null references orders(id),
  customer_id     uuid not null references users(id),
  vendor_id       uuid references vendors(id),
  driver_id       uuid references drivers(id),
  rating          smallint not null check (rating between 1 and 5),
  comment         text not null default '',
  created_at      timestamptz not null default now()
);

-- ─── promotions ───────────────────────────────────────────────────────────────

create table promotions (
  id              uuid primary key default gen_random_uuid(),
  vendor_id       uuid references vendors(id) on delete cascade,
  title           text not null,
  description     text not null default '',
  discount_pct    numeric(5,2),
  discount_fils   int,
  min_order_fils  int,
  starts_at       timestamptz not null,
  ends_at         timestamptz not null,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now()
);

-- ─── admin_settings ───────────────────────────────────────────────────────────
-- Single-row config table; app reads row id='default'.

create table admin_settings (
  id                             text primary key default 'default',
  default_commission_pct         numeric(5,2) not null default 12,
  food_commission_pct            numeric(5,2) not null default 12,
  products_commission_pct        numeric(5,2) not null default 12,
  service_fee_fils               int not null default 300,
  min_order_fils                 int not null default 2500,
  -- delivery tiers (fils)
  delivery_0_3km_fils            int not null default 700,
  delivery_3_6km_fils            int not null default 1000,
  delivery_6_9km_fils            int not null default 1300,
  delivery_9_12km_fils           int not null default 1600,
  delivery_12plus_fils           int not null default 2000,
  max_delivery_km                int not null default 15,
  -- driver pay tiers (fils)
  driver_pay_0_3km_fils          int not null default 500,
  driver_pay_3_6km_fils          int not null default 700,
  driver_pay_6_9km_fils          int not null default 900,
  driver_pay_9plus_fils          int not null default 1100,
  -- driver daily bonuses
  driver_bonus_tier1_deliveries  int not null default 10,
  driver_bonus_tier1_fils        int not null default 100,
  driver_bonus_tier2_deliveries  int not null default 20,
  driver_bonus_tier2_fils        int not null default 200,
  -- surcharges
  rush_surcharge_fils            int not null default 200,
  rush_driver_bonus_fils         int not null default 150,
  rain_surcharge_fils            int not null default 300,
  rain_driver_bonus_fils         int not null default 250,
  -- free delivery
  free_delivery_min_order_fils   int not null default 8000,
  free_delivery_vendor_shares    boolean not null default true,
  -- toggles
  cod_enabled                    boolean not null default true,
  online_payment_enabled         boolean not null default true,
  platform_paused                boolean not null default false,
  updated_at                     timestamptz not null default now()
);

-- Seed default settings row
insert into admin_settings (id) values ('default') on conflict do nothing;

-- ─── Row Level Security ───────────────────────────────────────────────────────

alter table users            enable row level security;
alter table vendors          enable row level security;
alter table products         enable row level security;
alter table drivers          enable row level security;
alter table orders           enable row level security;
alter table order_items      enable row level security;
alter table payments         enable row level security;
alter table vendor_payouts   enable row level security;
alter table driver_payouts   enable row level security;
alter table reviews          enable row level security;
alter table promotions       enable row level security;
alter table admin_settings   enable row level security;

-- Admins can read/write everything
create policy "admin_all" on users            for all using (auth.jwt() ->> 'role' = 'admin');
create policy "admin_all" on vendors          for all using (auth.jwt() ->> 'role' = 'admin');
create policy "admin_all" on products         for all using (auth.jwt() ->> 'role' = 'admin');
create policy "admin_all" on drivers          for all using (auth.jwt() ->> 'role' = 'admin');
create policy "admin_all" on orders           for all using (auth.jwt() ->> 'role' = 'admin');
create policy "admin_all" on vendor_payouts   for all using (auth.jwt() ->> 'role' = 'admin');
create policy "admin_all" on driver_payouts   for all using (auth.jwt() ->> 'role' = 'admin');
create policy "admin_all" on admin_settings   for all using (auth.jwt() ->> 'role' = 'admin');

-- Customers can see their own orders
create policy "customer_own_orders" on orders
  for select using (customer_id = auth.uid());

-- Vendors can see their own orders and products
create policy "vendor_own_orders" on orders
  for select using (vendor_id in (select id from vendors where user_id = auth.uid()));

create policy "vendor_own_products" on products
  for all using (vendor_id in (select id from vendors where user_id = auth.uid()));

-- Drivers can see assigned orders
create policy "driver_assigned_orders" on orders
  for select using (driver_id in (select id from drivers where user_id = auth.uid()));

-- Public read: active products, zones, categories, approved vendors
create policy "public_products"   on products          for select using (is_active = true);
create policy "public_zones"      on delivery_zones    for select using (is_active = true);
create policy "public_categories" on vendor_categories for select using (true);
create policy "public_vendors"    on vendors           for select using (status = 'approved');

-- ─── Indexes ──────────────────────────────────────────────────────────────────

create index idx_vendors_zone    on vendors(zone_id);
create index idx_vendors_cat     on vendors(category_id);
create index idx_vendors_status  on vendors(status);
create index idx_products_vendor on products(vendor_id);
create index idx_orders_customer on orders(customer_id);
create index idx_orders_vendor   on orders(vendor_id);
create index idx_orders_driver   on orders(driver_id);
create index idx_orders_status   on orders(status);
create index idx_orders_created  on orders(created_at desc);
