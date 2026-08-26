import { ClipboardList, DollarSign, Package, Users } from "lucide-react";

import { StatCard } from "@/components/admin/stat-card";
import { formatPrice } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [{ count: productCount }, { count: pendingOrders }, { count: customerCount }, { data: paidOrders }] =
    await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("delivery_status", "recebido"),
      supabase.from("customers").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("total").eq("payment_status", "pago"),
    ]);

  const revenue = (paidOrders ?? []).reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Faturamento (pago)" value={formatPrice(revenue)} icon={DollarSign} />
        <StatCard label="Pedidos novos" value={String(pendingOrders ?? 0)} icon={ClipboardList} />
        <StatCard label="Produtos cadastrados" value={String(productCount ?? 0)} icon={Package} />
        <StatCard label="Clientes cadastrados" value={String(customerCount ?? 0)} icon={Users} />
      </div>
    </div>
  );
}
