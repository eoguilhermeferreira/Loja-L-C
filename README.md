# L&C Imports

Loja virtual de variedades importadas (perfumes, tênis, eletrônicos, relógios,
fones e acessórios), com painel administrativo próprio e checkout com
pagamento transparente via Mercado Pago.

## Stack

- **Next.js 16** (App Router, Turbopack, Server Actions) + TypeScript
- **Tailwind CSS 4** + componentes de UI no padrão shadcn (montados à mão neste
  projeto, sem depender do registry remoto)
- **Supabase** (Postgres + Auth + Storage)
- **Mercado Pago** (Payment Bricks — Pix, cartão de crédito/débito, boleto)
- **Vercel** para deploy

Frete é calculado de forma simplificada (valor fixo + grátis acima de um
subtotal, configurável em `src/config/store.ts`) — sem integração com
transportadora. Não há envio de e-mail transacional.

## Estrutura de pastas

```
src/
├── app/
│   ├── (store)/          # loja: home, produtos, produto/[slug], categoria/[slug], carrinho, checkout
│   ├── admin/             # painel administrativo (login + área protegida)
│   ├── api/webhooks/mercadopago/route.ts
│   ├── sitemap.ts, robots.ts
│   └── layout.tsx
├── components/
│   ├── ui/                # primitivos de UI (button, input, dialog, table...)
│   ├── store/, cart/, checkout/, admin/, icons/
├── config/store.ts         # dados fixos da loja (nome, contato, frete)
├── lib/
│   ├── supabase/{client,server,admin}.ts
│   ├── queries.ts, mercadopago.ts, shipping.ts, format.ts, checkout-schema.ts
├── proxy.ts                 # protege /admin/* (renomeado de middleware.ts no Next 16)
└── types/database.types.ts
supabase/migrations/0001_init.sql
```

## Configurando o projeto do zero

1. **Supabase**: crie um projeto novo e rode `supabase/migrations/0001_init.sql`
   no SQL Editor (cria tabelas, enums, RLS, `is_admin()` e os buckets de
   Storage `products`/`categories`/`banners`).
2. **Usuário admin**: crie um usuário em *Authentication > Users* (e-mail/senha)
   e depois insira uma linha em `admin_profiles` com o mesmo `id`:
   ```sql
   insert into admin_profiles (id, email) values ('<uuid-do-usuario>', 'seu@email.com');
   ```
3. **Mercado Pago**: crie uma aplicação em *Suas integrações* no modelo
   "Checkout Transparente / Bricks" e gere as credenciais (Public Key e
   Access Token).
4. **Variáveis de ambiente**: copie `.env.example` para `.env.local` e
   preencha com as credenciais acima.
5. **Rodar localmente**:
   ```bash
   npm install
   npm run dev
   ```
6. Ajuste `src/config/store.ts` (nome, WhatsApp, Instagram, e-mail, frete) e
   cadastre categorias/banners/produtos pelo painel em `/admin`.

## Deploy

Conecte o repositório à Vercel, cadastre as mesmas variáveis de
`.env.example` em *Project Settings > Environment Variables*, defina
`NEXT_PUBLIC_SITE_URL` com o domínio final e configure a URL do webhook do
Mercado Pago (`/api/webhooks/mercadopago`) apontando para esse domínio.

## Possíveis evoluções futuras

- Baixa automática de estoque ao confirmar pagamento (hoje o estoque é
  ajustado manualmente pelo admin).
- E-mail transacional (ex: Resend) e cálculo de frete real por transportadora
  (ex: Melhor Envio), caso a loja volte a precisar deles.

---

_Deploy verificado em produção._
