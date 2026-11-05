create extension if not exists pgcrypto;

create table services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('Hair','Bridal','Skin','Nails','Spa')),
  duration_min int not null check (duration_min > 0),
  price_inr int check (price_inr >= 0),            -- null for Spa (price hidden)
  original_price_inr int check (original_price_inr >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table settings (
  id int primary key default 1 check (id = 1),     -- single row
  open_time time not null default '10:00',
  close_time time not null default '21:00',
  slot_minutes int not null default 30,
  capacity int not null default 8,
  min_notice_hours int not null default 2,
  max_days_ahead int not null default 60,
  max_bookings_per_phone_per_day int not null default 3,
  timezone text not null default 'Asia/Kolkata',
  owner_email text,
  owner_whatsapp text
);
insert into settings default values;

create table blocked_times (
  id uuid primary key default gen_random_uuid(),
  start_at timestamptz not null,
  end_at timestamptz not null,
  seats_blocked int,                                -- null = whole salon closed
  reason text,
  created_at timestamptz not null default now(),
  check (end_at > start_at)
);

create table bookings (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,                        -- e.g. SSL-7K3F9
  customer_name text not null check (char_length(customer_name) between 2 and 60),
  phone text not null check (phone ~ '^[6-9][0-9]{9}$'),
  start_at timestamptz not null,
  end_at timestamptz not null,
  status text not null default 'confirmed'
    check (status in ('confirmed','cancelled','completed','no_show')),
  coupon_code text,
  notes text,
  cancel_token_hash text not null,                  -- store only a hash
  reminder_sent_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  check (end_at > start_at)
);
create index bookings_active_range_idx on bookings (start_at, end_at) where status = 'confirmed';
create index bookings_phone_idx on bookings (phone, created_at);

create table booking_items (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete cascade,
  service_id uuid references services(id) on delete set null,
  service_name text not null,                       -- snapshot at booking time
  duration_min int not null,
  price_inr int
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id) on delete cascade,
  channel text not null check (channel in ('email','whatsapp')),
  kind text not null check (kind in ('owner_alert','client_confirmation','client_reminder','daily_summary')),
  status text not null check (status in ('sent','failed')),
  error text,
  created_at timestamptz not null default now()
);

create table admins (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);

alter table services enable row level security;
alter table settings enable row level security;
alter table blocked_times enable row level security;
alter table bookings enable row level security;
alter table booking_items enable row level security;
alter table notifications enable row level security;
alter table admins enable row level security;