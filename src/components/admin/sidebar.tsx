"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import {
  LayoutDashboard,
  Package,
  Tags,
  GalleryHorizontal,
  ClipboardList,
  Users,
  LogOut,
  Menu,
} from "lucide-react";

import { signOut } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { storeConfig } from "@/config/store";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/categorias", label: "Categorias", icon: Tags },
  { href: "/admin/banners", label: "Banners", icon: GalleryHorizontal },
  { href: "/admin/pedidos", label: "Pedidos", icon: ClipboardList },
  { href: "/admin/clientes", label: "Clientes", icon: Users },
];

function SidebarBrand() {
  return (
    <div className="flex items-center gap-2.5 border-b border-border p-4">
      <Image src="/logo.png" alt="" width={48} height={48} className="size-12 shrink-0 rounded-full" />
      <div>
        <span className="font-display text-base font-semibold text-accent">{storeConfig.name}</span>
        <p className="text-xs text-muted-foreground">Painel administrativo</p>
      </div>
    </div>
  );
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-1 p-3">
      {NAV_ITEMS.map((item) => {
        const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-foreground/80 hover:bg-secondary"
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SignOutForm() {
  return (
    <form action={signOut} className="border-t border-border p-3">
      <button
        type="submit"
        className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-destructive"
      >
        <LogOut className="size-4" /> Sair
      </button>
    </form>
  );
}

export function AdminSidebar() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div className="flex items-center justify-between border-b border-border bg-card p-3 lg:hidden">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="" width={36} height={36} className="size-9 rounded-full" />
          <span className="font-display text-sm font-semibold text-accent">{storeConfig.name}</span>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Abrir menu">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex w-72 flex-col gap-0 p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Menu do painel</SheetTitle>
            </SheetHeader>
            <SidebarBrand />
            <SidebarNav onNavigate={() => setOpen(false)} />
            <SignOutForm />
          </SheetContent>
        </Sheet>
      </div>

      <aside className="hidden h-screen w-60 shrink-0 flex-col border-r border-border bg-card lg:flex">
        <SidebarBrand />
        <SidebarNav />
        <SignOutForm />
      </aside>
    </>
  );
}
