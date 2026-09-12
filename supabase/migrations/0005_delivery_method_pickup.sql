-- Retirada na loja: método de entrega por pedido + status "pronto para retirar".

create type public.delivery_method as enum ('entrega', 'retirada');

alter table public.orders
  add column delivery_method public.delivery_method not null default 'entrega';

alter type public.delivery_status add value if not exists 'pronto_para_retirar';
