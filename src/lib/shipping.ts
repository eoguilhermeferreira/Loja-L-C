import { storeConfig } from "@/config/store";

/**
 * Frete simplificado (sem integração com transportadora): valor fixo,
 * grátis acima de um determinado subtotal. Recebe o subtotal em reais.
 */
export function calculateShipping(subtotal: number): {
  cost: number;
  isFree: boolean;
  label: string;
} {
  const { flatRateCents, freeAboveCents } = storeConfig.shipping;
  const subtotalCents = Math.round(subtotal * 100);
  const isFree = subtotalCents >= freeAboveCents;

  return {
    cost: isFree ? 0 : flatRateCents / 100,
    isFree,
    label: isFree ? "Frete grátis" : "Frete padrão",
  };
}

export function amountToFreeShipping(subtotal: number): number {
  const { freeAboveCents } = storeConfig.shipping;
  const subtotalCents = Math.round(subtotal * 100);
  return Math.max(0, (freeAboveCents - subtotalCents) / 100);
}
