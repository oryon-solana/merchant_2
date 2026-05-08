-- Fix products.user_id FK: point to public.users instead of auth.users
alter table public.products drop constraint if exists products_user_id_fkey;
alter table public.products
  add constraint products_user_id_fkey
  foreign key (user_id) references public.users(id) on delete cascade;

-- Drop the old RLS policy that relies on auth.uid() (no longer used for app users)
drop policy if exists "users manage own products" on public.products;
