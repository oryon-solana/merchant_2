alter table public.user_points
  add column if not exists wallet_address text unique;
