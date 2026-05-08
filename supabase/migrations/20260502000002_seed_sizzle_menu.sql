-- Replace old products with the Sizzle fast food menu items
-- (matches app/menu/page.tsx and public/menu/ images)
delete from public.products where user_id is null;

insert into public.products (id, user_id, name, description, price, stock, image_url) values
  ('22222222-0000-0000-0000-000000000001', null, 'Crispy Chicken Bites',     'Hand-breaded bites, ranch dip, extra crunch.',                       48000, 999, '/menu/crispy-chicken-bites.webp'),
  ('22222222-0000-0000-0000-000000000002', null, 'Buffalo Chicken Wrap',     'Crispy strips, lettuce, pickles, spicy mayo.',                       52000, 999, '/menu/buffalo-chicken-wrap.webp'),
  ('22222222-0000-0000-0000-000000000003', null, 'Grilled Chicken Sandwich', 'Toasted bun, grilled chicken, lettuce, tomato, mayo.',               55000, 999, '/menu/chicken-grilled-sandwich.webp'),
  ('22222222-0000-0000-0000-000000000004', null, 'Eggs & Bacon Waffles',     'Sweet waffles, eggs, and crispy bacon breakfast stack.',             52000, 999, '/menu/eggs-bacon-waffles.webp'),
  ('22222222-0000-0000-0000-000000000005', null, 'Value Max Combo',          'Burger, fries, nuggets, and a fountain drink.',                      65000, 999, '/menu/value-max-combo.webp'),
  ('22222222-0000-0000-0000-000000000006', null, 'Loaded Fries',             'Crinkle fries, cheese sauce, bacon bits, jalapenos.',               42000, 999, '/menu/loaded-fries.webp'),
  ('22222222-0000-0000-0000-000000000007', null, 'Loaded Mac & Cheese',      'Creamy cheddar pasta topped with crispy onions.',                   45000, 999, '/menu/loaded-mac-cheese.webp'),
  ('22222222-0000-0000-0000-000000000008', null, 'Vanilla Mega Shake',       'Thick vanilla shake with whipped cream and cookie crumbs.',         36000, 999, '/menu/vanilla-mega-shake.webp')
on conflict (id) do update set
  name        = excluded.name,
  description = excluded.description,
  price       = excluded.price,
  stock       = excluded.stock,
  image_url   = excluded.image_url;
