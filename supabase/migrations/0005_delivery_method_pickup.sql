-- Retirada na loja: método de entrega por pedido + status "pronto para retirar".
-- Idempotente (seguro rodar de novo) caso uma tentativa anterior já tenha
-- criado parte disso.

do $$
begin
  if not exists (select 1 from pg_type where typname = 'delivery_method') then
    create type public.delivery_method as enum ('entrega', 'retirada');
  end if;
end$$;

alter table public.orders
  add column if not exists delivery_method public.delivery_method not null default 'entrega';

alter type public.delivery_status add value if not exists 'pronto_para_retirar';
