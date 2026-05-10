alter table public.orders
  add column if not exists points_spent  integer not null default 0
    check (points_spent >= 0),
  add column if not exists payment_method text not null default 'cash'
    check (payment_method in ('cash', 'card', 'wallet', 'points'));
