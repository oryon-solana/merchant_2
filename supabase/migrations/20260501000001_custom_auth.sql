-- Custom users table (replaces Supabase auth.users for application users)
create table if not exists public.users (
  id            uuid        primary key default gen_random_uuid(),
  email         text        unique not null,
  name          text,
  password_hash text,
  google_id     text        unique,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Re-point cart_items FK from auth.users → public.users
alter table public.cart_items drop constraint if exists cart_items_user_id_fkey;
alter table public.cart_items
  add constraint cart_items_user_id_fkey
  foreign key (user_id) references public.users(id) on delete cascade;

-- Re-point orders FK
alter table public.orders drop constraint if exists orders_user_id_fkey;
alter table public.orders
  add constraint orders_user_id_fkey
  foreign key (user_id) references public.users(id) on delete cascade;

-- Re-point user_points FK
alter table public.user_points drop constraint if exists user_points_user_id_fkey;
alter table public.user_points
  add constraint user_points_user_id_fkey
  foreign key (user_id) references public.users(id) on delete cascade;

-- Re-point point_transactions FK
alter table public.point_transactions drop constraint if exists point_transactions_user_id_fkey;
alter table public.point_transactions
  add constraint point_transactions_user_id_fkey
  foreign key (user_id) references public.users(id) on delete cascade;
