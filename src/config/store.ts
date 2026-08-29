/**
 * Dados fixos da loja. Centralizado aqui para trocar em um único lugar
 * quando a loja mudar de nome, contato ou política de frete.
 */
export const storeConfig = {
  name: "L&C Imports",
  shortName: "L&C",
  description:
    "Roupas masculinas e femininas, tênis e acessórios com entrega local em Avaré/SP.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  contact: {
    whatsapp: "5514997998468",
    email: "lcimportsavare@gmail.com",
    instagram: "https://instagram.com/lc.importsoficial_",
    tiktok: "https://www.tiktok.com/@lc.imports.ofc",
    facebook: "https://www.facebook.com/LCImports",
  },

  address: {
    city: "Avaré",
    state: "SP",
  },

  /**
   * Frete simplificado: valor fixo + gratuidade acima de um teto.
   * A loja de referência usava a API do Melhor Envio; aqui optamos por um
   * cálculo fixo, configurável direto no código (dá pra evoluir depois
   * para faixas por região sem mudar a assinatura de `calculateShipping`).
   *
   * Entrega restrita à cidade da loja por enquanto — `deliveryCity`/
   * `deliveryState` são checados no schema de checkout (client e server).
   */
  shipping: {
    flatRateCents: 1000,
    freeAboveCents: 29900,
    deliveryCity: "Avaré",
    deliveryState: "SP",
  },
} as const;
