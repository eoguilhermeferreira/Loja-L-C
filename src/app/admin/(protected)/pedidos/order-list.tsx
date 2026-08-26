"use client";

import Link from "next/link";
import * as React from "react";

import { getOrders } from "@/app/admin/(protected)/pedidos/actions";
import { DeliveryStatusBadge, PaymentStatusBadge } from "@/components/admin/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime, formatPrice } from "@/lib/format";
import type { OrderWithItems } from "@/types/database.types";

const POLL_INTERVAL_MS = 8000;

export function OrderList({ initialOrders }: { initialOrders: OrderWithItems[] }) {
  const [orders, setOrders] = React.useState(initialOrders);

  React.useEffect(() => {
    const interval = setInterval(async () => {
      if (document.visibilityState !== "visible") return;
      const fresh = await getOrders();
      setOrders(fresh);
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pedido</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Pagamento</TableHead>
            <TableHead>Entrega</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="cursor-pointer">
              <TableCell className="p-0">
                <Link
                  href={`/admin/pedidos/${order.id}`}
                  className="block px-3 py-3 font-medium"
                >
                  #{order.order_number}
                </Link>
              </TableCell>
              <TableCell>{order.customer_name}</TableCell>
              <TableCell className="text-muted-foreground">{formatDateTime(order.created_at)}</TableCell>
              <TableCell>{formatPrice(order.total)}</TableCell>
              <TableCell>
                <PaymentStatusBadge status={order.payment_status} />
              </TableCell>
              <TableCell>
                <DeliveryStatusBadge status={order.delivery_status} />
              </TableCell>
            </TableRow>
          ))}
          {orders.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                Nenhum pedido ainda.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
