/**
 * Dados fixos da loja. Centralizado aqui para trocar em um único lugar
 * quando a loja mudar de nome, contato ou política de frete.
 */
export const storeConfig = {
  name: "L&C Imports",
  shortName: "L&C",
  description:
    "Perfumes, tênis, eletrônicos, relógios e acessórios importados com frete rápido para todo o Brasil.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  contact: {
    whatsapp: "5511999999999",
    email: "contato@lcimports.com.br",
    instagram: "https://instagram.com/lcimports",
  },

  address: {
    city: "São Paulo",
    state: "SP",
  },

  /**
   * Frete simplificado: valor fixo + gratuidade acima de um teto.
   * A loja de referência usava a API do Melhor Envio; aqui optamos por um
   * cálculo fixo, configurável direto no código (dá pra evoluir depois
   * para faixas por região sem mudar a assinatura de `calculateShipping`).
   */
  shipping: {
    flatRateCents: 1990,
    freeAboveCents: 29900,
  },
} as const;
