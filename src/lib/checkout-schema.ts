import { z } from "zod";

import { storeConfig } from "@/config/store";
import { slugify } from "@/lib/format";

const { deliveryCity, deliveryState } = storeConfig.shipping;

export const checkoutSchema = z
  .object({
    customerName: z.string().trim().min(3, "Informe seu nome completo"),
    email: z.string().trim().email("E-mail inválido"),
    phone: z.string().trim().min(10, "Informe um telefone com DDD"),
    deliveryMethod: z.enum(["entrega", "retirada"]),
    cep: z.string().trim().optional().default(""),
    street: z.string().trim().optional().default(""),
    number: z.string().trim().optional().default(""),
    complement: z.string().trim().optional(),
    neighborhood: z.string().trim().optional().default(""),
    city: z.string().trim().optional().default(""),
    state: z.string().trim().optional().default(""),
    paymentMethod: z.enum(["pix", "cartao_credito", "cartao_debito", "boleto"]),
  })
  .superRefine((data, ctx) => {
    // Retirada na loja não precisa de endereço de entrega.
    if (data.deliveryMethod !== "entrega") return;

    if (data.cep.length !== 8) {
      ctx.addIssue({ code: "custom", message: "CEP inválido", path: ["cep"] });
    }
    if (data.street.length < 2) {
      ctx.addIssue({ code: "custom", message: "Informe a rua", path: ["street"] });
    }
    if (data.number.length < 1) {
      ctx.addIssue({ code: "custom", message: "Informe o número", path: ["number"] });
    }
    if (data.neighborhood.length < 2) {
      ctx.addIssue({ code: "custom", message: "Informe o bairro", path: ["neighborhood"] });
    }
    if (data.city.length < 2) {
      ctx.addIssue({ code: "custom", message: "Informe a cidade", path: ["city"] });
    }
    if (data.state.length !== 2) {
      ctx.addIssue({ code: "custom", message: "UF inválida", path: ["state"] });
    } else if (
      slugify(data.city) !== slugify(deliveryCity) ||
      data.state.trim().toUpperCase() !== deliveryState
    ) {
      ctx.addIssue({
        code: "custom",
        message: `No momento só entregamos em ${deliveryCity}/${deliveryState}`,
        path: ["city"],
      });
    }
  });

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export const checkoutItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
  variationId: z.string().uuid().optional(),
});

export type CheckoutItemInput = z.infer<typeof checkoutItemSchema>;
