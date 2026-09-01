-- Placement identifica em qual bloco fixo da home o banner aparece.
-- 'carousel' continua suportando múltiplos banners (carrossel do topo).
-- Os outros são slots únicos que hoje eram fixos no código.
create type public.banner_placement as enum (
  'carousel',
  'promo_left',
  'promo_right',
  'square',
  'promo_wide'
);

alter table public.banners
  add column placement public.banner_placement not null default 'carousel',
  add column eyebrow text;

-- Migra os 4 banners promocionais que estavam fixos no código da home
-- para linhas editáveis, preservando as imagens já geradas/publicadas.
insert into public.banners (image_url, eyebrow, title, description, button_label, button_link, placement, display_order, is_active) values
  (
    'https://d8j0ntlcm91z4.cloudfront.net/user_3DddW0JRUDw0aHbl43U3f1JTg8N/hf_20260827_022424_7e0d012a-60ba-420f-a189-3573b957cedd.png',
    'Para eles',
    'Estilo que fala por você',
    'Peças essenciais pra montar looks confiantes no dia a dia.',
    'Ver coleção masculina',
    '/produtos?genero=masculino',
    'promo_left',
    1,
    true
  ),
  (
    'https://d8j0ntlcm91z4.cloudfront.net/user_3DddW0JRUDw0aHbl43U3f1JTg8N/hf_20260827_022446_d4f98bb2-1547-416b-beb2-8ce3ebfedd77.png',
    'Para elas',
    'Presenteie quem você ama',
    'Vestidos, blusas e muito mais pra ela se sentir incrível.',
    'Ver coleção feminina',
    '/produtos?genero=feminino',
    'promo_right',
    1,
    true
  ),
  (
    'https://d8j0ntlcm91z4.cloudfront.net/user_3DddW0JRUDw0aHbl43U3f1JTg8N/hf_20260826_044208_533b0845-2bfc-43b5-bf3c-8c93e0457558.png',
    'Edição limitada',
    'Presenteie alguém que merece se vestir com estilo',
    'Peças selecionadas que unem conforto e atitude — pra presentear ou se presentear.',
    'Ver a coleção',
    '/produtos',
    'square',
    1,
    true
  ),
  (
    'https://d8j0ntlcm91z4.cloudfront.net/user_3DddW0JRUDw0aHbl43U3f1JTg8N/hf_20260827_022508_4fb4a4f3-01fe-4c98-8c6f-71f0f9100f4c.png',
    'Atendimento',
    'Ainda com dúvida sobre o tamanho ideal?',
    'Nosso time responde rapidinho pelo WhatsApp e te ajuda a escolher certo.',
    'Chamar no WhatsApp',
    'https://wa.me/5514997998468',
    'promo_wide',
    1,
    true
  );
