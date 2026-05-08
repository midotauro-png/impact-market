-- Bahrain Marketplace — Full Supabase Schema
-- Run via: supabase db push  OR  paste into Supabase SQL editor

-- ─── Extensions ──────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists "postgis"; -- for geo queries (optional)

-- ─── Zones ───────────────────────────────────────────────────────────────────
create table if not exists zones (
  id                      text primary key,
  name                    text not null,
  slug                    text unique not null,
  cities                  text[] not null default '{}',
  polygon                 jsonb not null default '[]',  -- [{lat,lng},...]
  centroid_lat            double precision not null,
  centroid_lng            double precision not null,
  base_delivery_fee_fils  integer not null default 1000,
  min_order_fils          integer not null default 2000,
  estimated_delivery_min  integer not null default 30,
  is_active               boolean not null default true,
  created_at              timestamptz default now()
);

-- ─── Profiles (extends Supabase auth.users) ───────────────────────────────────
create table if not exists profiles (
  id         uuid primary key references auth.users on delete cascade,
  full_name  text,
  phone      text,
  role       text not null check (role in ('admin','vendor','driver','customer')) default 'customer',
  created_at timestamptz default now()
);
alter table profiles enable row level security;
create policy "Users see own profile" on profiles for select using (auth.uid() = id);
create policy "Users update own profile" on profiles for update using (auth.uid() = id);

-- ─── Vendor Categories ────────────────────────────────────────────────────────
create table if not exists vendor_categories (
  id             text primary key,
  slug           text unique not null,
  name           text not null,
  icon           text default '🛍️',
  commission_pct integer not null default 15,
  created_at     timestamptz default now()
);

-- ─── Vendors ─────────────────────────────────────────────────────────────────
create table if not exists vendors (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid references auth.users on delete set null,
  business_name       text not null,
  owner_name          text not null,
  phone               text not null,
  email               text not null,
  cr_number           text,
  category_id         text references vendor_categories(id),
  address             text not null,
  lat                 double precision not null,
  lng                 double precision not null,
  zone_id             text references zones(id),
  delivery_radius_km  integer not null default 8,
  opening_hours       jsonb not null default '{"open":"08:00","close":"22:00","days":[0,1,2,3,4,5,6]}',
  logo_url            text,
  cover_url           text,
  status              text not null check (status in ('pending','approved','rejected','suspended')) default 'pending',
  commission_pct      integer not null default 15,
  is_featured         boolean not null default false,
  rating              numeric(3,2) not null default 0,
  total_orders        integer not null default 0,
  is_open             boolean not null default false,
  iban                text,
  created_at          timestamptz default now()
);
alter table vendors enable row level security;
create policy "Approved vendors are public" on vendors for select using (status = 'approved');
create policy "Vendor manages own store" on vendors for all using (auth.uid() = user_id);
create policy "Admin manages all vendors" on vendors for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- ─── Products ─────────────────────────────────────────────────────────────────
create table if not exists products (
  id          uuid primary key default uuid_generate_v4(),
  vendor_id   uuid references vendors(id) on delete cascade,
  category_id text references vendor_categories(id),
  name        text not null,
  description text,
  price_fils  integer not null,
  stock       integer not null default 0,
  images      text[] default '{}',
  is_active   boolean not null default true,
  created_at  timestamptz default now()
);
alter table products enable row level security;
create policy "Active products are public" on products for select using (is_active = true);
create policy "Vendor manages own products" on products for all using (
  vendor_id in (select id from vendors where user_id = auth.uid())
);

-- ─── Orders ──────────────────────────────────────────────────────────────────
create table if not exists orders (
  id                   uuid primary key default uuid_generate_v4(),
  short_code           text unique not null,
  customer_id          uuid references auth.users on delete set null,
  customer_name        text not null,
  customer_phone       text not null,
  vendor_id            uuid references vendors(id) on delete set null,
  driver_id            uuid references auth.users on delete set null,
  customer_zone_id     text references zones(id),
  vendor_zone_id       text references zones(id),
  delivery_address     text not null,
  delivery_lat         double precision,
  delivery_lng         double precision,
  items                jsonb not null default '[]',
  subtotal_fils        integer not null,
  delivery_fee_fils    integer not null,
  service_fee_fils     integer not null,
  commission_fils      integer not null,
  driver_payout_fils   integer not null,
  admin_profit_fils    integer not null,
  vendor_net_fils      integer not null,
  total_fils           integer not null,
  payment_method       text not null check (payment_method in ('online','cash_on_delivery')) default 'cash_on_delivery',
  payment_status       text not null check (payment_status in ('pending','paid','failed','refunded')) default 'pending',
  status               text not null default 'pending_payment',
  tap_charge_id        text,
  created_at           timestamptz default now(),
  updated_at           timestamptz default now()
);
alter table orders enable row level security;
create policy "Customers see own orders" on orders for select using (auth.uid() = customer_id);
create policy "Vendor sees their orders" on orders for select using (
  vendor_id in (select id from vendors where user_id = auth.uid())
);
create policy "Driver sees assigned orders" on orders for select using (auth.uid() = driver_id);
create policy "Admin sees all orders" on orders for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Checkout creates orders" on orders for insert with check (true);

-- ─── Drivers ─────────────────────────────────────────────────────────────────
create table if not exists drivers (
  id                   uuid primary key default uuid_generate_v4(),
  user_id              uuid references auth.users on delete set null,
  full_name            text not null,
  phone                text not null,
  email                text not null,
  cpr                  text,
  vehicle_type         text not null check (vehicle_type in ('bike','car','scooter')),
  vehicle_plate        text not null,
  lat                  double precision,
  lng                  double precision,
  active_zone_id       text references zones(id),
  preferred_zone_ids   text[] default '{}',
  is_online            boolean not null default false,
  status               text not null check (status in ('pending','approved','rejected','suspended')) default 'pending',
  rating               numeric(3,2) not null default 0,
  total_deliveries     integer not null default 0,
  wallet_fils          integer not null default 0,
  iban                 text,
  created_at           timestamptz default now()
);
alter table drivers enable row level security;
create policy "Driver manages own record" on drivers for all using (auth.uid() = user_id);
create policy "Admin manages drivers" on drivers for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- ─── Vendor Payouts ───────────────────────────────────────────────────────────
create table if not exists vendor_payouts (
  id          uuid primary key default uuid_generate_v4(),
  vendor_id   uuid references vendors(id) on delete cascade,
  order_id    uuid references orders(id) on delete set null,
  gross_fils  integer not null,
  commission_fils integer not null,
  net_fils    integer not null,
  status      text not null check (status in ('pending','paid')) default 'pending',
  paid_at     timestamptz,
  created_at  timestamptz default now()
);

-- ─── Driver Payouts ───────────────────────────────────────────────────────────
create table if not exists driver_payouts (
  id          uuid primary key default uuid_generate_v4(),
  driver_id   uuid references drivers(id) on delete cascade,
  order_id    uuid references orders(id) on delete set null,
  amount_fils integer not null,
  status      text not null check (status in ('pending','paid')) default 'pending',
  paid_at     timestamptz,
  created_at  timestamptz default now()
);

-- ─── Reviews ─────────────────────────────────────────────────────────────────
create table if not exists reviews (
  id            uuid primary key default uuid_generate_v4(),
  order_id      uuid references orders(id) on delete cascade,
  customer_id   uuid references auth.users on delete set null,
  customer_name text not null,
  vendor_id     uuid references vendors(id) on delete set null,
  driver_id     uuid references drivers(id) on delete set null,
  rating        integer not null check (rating between 1 and 5),
  comment       text,
  created_at    timestamptz default now()
);
alter table reviews enable row level security;
create policy "Reviews are public" on reviews for select using (true);
create policy "Customer submits review" on reviews for insert with check (auth.uid() = customer_id);

-- ─── Promo Codes ─────────────────────────────────────────────────────────────
create table if not exists promo_codes (
  id              uuid primary key default uuid_generate_v4(),
  code            text unique not null,
  discount_pct    integer,
  discount_fils   integer,
  min_order_fils  integer default 0,
  max_uses        integer,
  used_count      integer default 0,
  expires_at      timestamptz,
  is_active       boolean default true,
  created_at      timestamptz default now()
);

-- ─── Auto-update updated_at ──────────────────────────────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger orders_updated_at before update on orders
  for each row execute function update_updated_at();

-- ─── Seed: Zones ─────────────────────────────────────────────────────────────
insert into zones (id, name, slug, cities, centroid_lat, centroid_lng, base_delivery_fee_fils, min_order_fils, estimated_delivery_min) values
  ('z-manama',    'Manama',       'manama',    '{"Manama","Government Area","Diplomatic Area"}', 26.2154, 50.5860, 1000, 2000, 25),
  ('z-juffair',   'Juffair',      'juffair',   '{"Juffair","Umm Al Hassam"}',                   26.2034, 50.5975, 1000, 2000, 25),
  ('z-adliya',    'Adliya',       'adliya',    '{"Adliya","Salmaniya"}',                         26.2124, 50.5803, 1000, 2000, 20),
  ('z-seef',      'Seef',         'seef',      '{"Seef","Sanabis"}',                             26.2285, 50.5401, 1200, 2000, 30),
  ('z-muharraq',  'Muharraq',     'muharraq',  '{"Muharraq","Arad","Galali"}',                   26.2583, 50.6200, 1500, 2000, 35),
  ('z-riffa',     'Riffa',        'riffa',     '{"East Riffa","West Riffa"}',                    26.1299, 50.6580, 1500, 2000, 40),
  ('z-isa-town',  'Isa Town',     'isa-town',  '{"Isa Town","Nuwaidrat"}',                       26.1745, 50.5529, 1200, 2000, 35),
  ('z-hamad-town','Hamad Town',   'hamad-town','{"Hamad Town"}',                                 26.1280, 50.5088, 1500, 2000, 45),
  ('z-budaiya',   'Budaiya',      'budaiya',   '{"Budaiya","Jasra"}',                            26.2115, 50.4612, 1500, 2000, 40),
  ('z-saar',      'Saar',         'saar',      '{"Saar","Janabiyah"}',                           26.2106, 50.4904, 1200, 2000, 35),
  ('z-zinj',      'Zinj',         'zinj',      '{"Zinj","Qudaibiya"}',                           26.1944, 50.5814, 1000, 2000, 25),
  ('z-hoora',     'Hoora',        'hoora',     '{"Hoora"}',                                      26.2239, 50.5837, 1000, 2000, 20),
  ('z-hidd',      'Hidd',         'hidd',      '{"Hidd"}',                                       26.2565, 50.6484, 1500, 2000, 40),
  ('z-amwaj',     'Amwaj Islands','amwaj',     '{"Amwaj Islands"}',                              26.2814, 50.6383, 2000, 3000, 50),
  ('z-aali',      'Aali',         'aali',      '{"Aali","Jaw"}',                                 26.1520, 50.5428, 1200, 2000, 35)
on conflict (id) do nothing;

-- ─── Seed: Categories ────────────────────────────────────────────────────────
insert into vendor_categories (id, slug, name, icon, commission_pct) values
  ('cat-bahraini-food', 'bahraini-food', 'Bahraini Food',    '🍛', 12),
  ('cat-restaurants',   'restaurants',   'Restaurants',      '🍽️', 15),
  ('cat-homemade',      'homemade',      'Homemade Food',    '🏠', 12),
  ('cat-groceries',     'groceries',     'Groceries',        '🛒', 10),
  ('cat-bakery',        'bakery',        'Bakery & Sweets',  '🥐', 12),
  ('cat-african-food',  'african-food',  'African Food',     '🌍', 12),
  ('cat-beauty',        'beauty',        'Beauty & Hair',    '💄', 15),
  ('cat-clothes',       'clothes',       'Clothes & Fashion','👗', 15),
  ('cat-electronics',   'electronics',   'Electronics',      '📱', 18),
  ('cat-perfume',       'perfume',       'Oud & Perfume',    '🪔', 15),
  ('cat-accessories',   'accessories',   'Accessories',      '💍', 15),
  ('cat-services',      'services',      'Services',         '🔧', 20)
on conflict (id) do nothing;
