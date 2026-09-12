import { storeConfig } from "@/config/store";
import type { DeliveryMethod } from "@/types/database.types";

/**
 * Frete simplificado (sem integração com transportadora): valor fixo,
 * já que a entrega é restrita a Avaré/SP. Retirada na loja não tem custo.
 */
export function calculateShipping(method: DeliveryMethod = "entrega"): {
  cost: number;
  label: string;
} {
  if (method === "retirada") {
    return { cost: 0, label: "Retirada na loja" };
  }

  const { flatRateCents } = storeConfig.shipping;

  return {
    cost: flatRateCents / 100,
    label: "Frete padrão",
  };
}
