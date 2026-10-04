create table if not exists public.orders (
  id uuid primary key,
  created_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new', 'processing', 'completed', 'cancelled')),
  customer jsonb not null,
  contact_method text not null check (contact_method in ('Telegram', 'WhatsApp', 'MAX')),
  items jsonb not null,
  total bigint not null check (total >= 0)
);

create index if not exists orders_created_at_desc_idx on public.orders (created_at desc);

alter table public.orders enable row level security;
revoke all on public.orders from anon, authenticated;
grant all on public.orders to service_role;

create table if not exists public.reservations (
  id uuid primary key,
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  date date not null,
  time time not null,
  guests integer not null check (guests between 1 and 7),
  comment text not null default ''
);

create index if not exists reservations_created_at_desc_idx on public.reservations (created_at desc);
alter table public.reservations enable row level security;
revoke all on public.reservations from anon, authenticated;
grant all on public.reservations to service_role;
