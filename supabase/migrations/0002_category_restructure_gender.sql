-- Gênero do produto (usado como filtro na loja; unissex serve para os dois)
create type public.product_gender as enum ('masculino', 'feminino', 'unissex');

alter table public.products
  add column gender public.product_gender not null default 'unissex';

-- Recategoriza por tipo de peça (em vez de masculino/feminino) — cada categoria
-- serve os dois gêneros, com o filtro de gênero fazendo o recorte.
insert into public.categories (name, slug, icon, display_order) values
  ('Camisetas', 'camisetas', 'camiseta', 1),
  ('Calças', 'calcas', 'calca', 2),
  ('Blusas de Frio', 'blusas-de-frio', 'blusa-frio', 3),
  ('Vestidos & Saias', 'vestidos-saias', 'vestido', 4),
  ('Shorts & Bermudas', 'shorts-bermudas', 'short', 5),
  ('Conjuntos', 'conjuntos', 'conjunto', 6),
  ('Camisas', 'camisas', 'camisa', 7),
  ('Blusas', 'blusas', 'blusa', 8);

update public.categories set display_order = 9 where slug = 'tenis';
update public.categories set display_order = 10 where slug = 'acessorios';

update public.products set
  category_id = (select id from public.categories where slug = 'shorts-bermudas'),
  gender = 'masculino'
  where slug = 'bermuda-sarja-masculina';

update public.products set
  category_id = (select id from public.categories where slug = 'calcas'),
  gender = 'masculino'
  where slug = 'calca-jeans-masculina-slim';

update public.products set
  category_id = (select id from public.categories where slug = 'camisas'),
  gender = 'masculino'
  where slug = 'camisa-social-slim-fit-branca';

update public.products set
  category_id = (select id from public.categories where slug = 'camisetas'),
  gender = 'unissex'
  where slug = 'camiseta-basica-algodao-preta';

update public.products set
  category_id = (select id from public.categories where slug = 'blusas-de-frio'),
  gender = 'masculino'
  where slug = 'jaqueta-corta-vento-masculina';

update public.products set
  category_id = (select id from public.categories where slug = 'blusas'),
  gender = 'feminino'
  where slug = 'blusa-cropped-canelada';

update public.products set
  category_id = (select id from public.categories where slug = 'calcas'),
  gender = 'feminino'
  where slug = 'calca-legging-feminina';

update public.products set
  category_id = (select id from public.categories where slug = 'conjuntos'),
  gender = 'feminino'
  where slug = 'conjunto-moletom-feminino';

update public.products set
  category_id = (select id from public.categories where slug = 'vestidos-saias'),
  gender = 'feminino'
  where slug = 'saia-jeans-feminina';

update public.products set
  category_id = (select id from public.categories where slug = 'vestidos-saias'),
  gender = 'feminino'
  where slug = 'vestido-midi-floral';

update public.products set gender = 'unissex' where slug = 'tenis-casual-urban-branco';
update public.products set gender = 'feminino' where slug = 'tenis-chunky-feminino';
update public.products set gender = 'unissex' where slug = 'tenis-esportivo-performance';
update public.products set gender = 'unissex' where slug = 'tenis-slip-on-casual';

delete from public.categories where slug in ('roupas-masculinas', 'roupas-femininas');
