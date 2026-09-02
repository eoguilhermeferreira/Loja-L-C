alter type public.banner_placement add value 'video';
alter table public.banners alter column image_url drop not null;
alter table public.banners add column video_url text;

insert into public.banners (placement, video_url, eyebrow, title, description, button_label, button_link, display_order, is_active) values (
  'video',
  'https://d2ol7oe51mr4n9.cloudfront.net/user_3DddW0JRUDw0aHbl43U3f1JTg8N/2ffa7644-3cef-4786-8ab5-b0d74526a7e4.mp4',
  'Nova coleção',
  'Estilo em movimento',
  'Confira os bastidores e vista o que há de mais novo na L&C',
  'Ver coleção',
  '/produtos',
  0,
  true
);
