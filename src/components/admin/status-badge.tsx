import { Badge, type badgeVariants } from "@/components/ui/badge";
import type { VariantProps } from "class-variance-authority";
import type { DeliveryMethod, DeliveryStatus, PaymentStatus } from "@/types/database.types";

type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

const PAYMENT_LABELS: Record<PaymentStatus, { label: string; variant: BadgeVariant }> = {
  pendente: { label: "Pendente", variant: "warning" },
  pago: { label: "Pago", variant: "success" },
  falhou: { label: "Falhou", variant: "destructive" },
  reembolsado: { label: "Reembolsado", variant: "secondary" },
};

const DELIVERY_LABELS: Record<DeliveryStatus, { label: string; variant: BadgeVariant }> = {
  recebido: { label: "Recebido", variant: "outline" },
  preparando: { label: "Preparando", variant: "warning" },
  enviado: { label: "Enviado", variant: "default" },
  entregue: { label: "Entregue", variant: "success" },
  pronto_para_retirar: { label: "Pronto para retirar", variant: "default" },
  cancelado: { label: "Cancelado", variant: "destructive" },
};

/** Status válidos por método de entrega — retirada não passa por Enviado/Entregue. */
const DELIVERY_STATUS_BY_METHOD: Record<DeliveryMethod, DeliveryStatus[]> = {
  entrega: ["recebido", "preparando", "enviado", "entregue", "cancelado"],
  retirada: ["recebido", "preparando", "pronto_para_retirar", "cancelado"],
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const { label, variant } = PAYMENT_LABELS[status];
  return <Badge variant={variant}>{label}</Badge>;
}

export function DeliveryStatusBadge({ status }: { status: DeliveryStatus }) {
  const { label, variant } = DELIVERY_LABELS[status];
  return <Badge variant={variant}>{label}</Badge>;
}

export function DeliveryMethodBadge({ method }: { method: DeliveryMethod }) {
  if (method !== "retirada") return null;
  return <Badge variant="secondary">Retirada</Badge>;
}

export { PAYMENT_LABELS, DELIVERY_LABELS, DELIVERY_STATUS_BY_METHOD };
