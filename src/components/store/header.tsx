"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import { Menu, Search, X } from "lucide-react";

import { CartSheet } from "@/components/store/cart-sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { storeConfig } from "@/config/store";
import type { Category } from "@/types/database.types";

export function Header({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const topLevel = categories.filter((c) => !c.parent_id);
  const [mobileSearchOpen, setMobileSearchOpen] = React.useState(false);
  const mobileSearchRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (mobileSearchOpen) mobileSearchRef.current?.focus();
  }, [mobileSearchOpen]);

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const search = new FormData(event.currentTarget).get("q");
    if (typeof search === "string" && search.trim()) {
      router.push(`/produtos?busca=${encodeURIComponent(search.trim())}`);
      setMobileSearchOpen(false);
    }
  }

  return (
    <header
      className={cn(
        "z-40 w-full",
        isHome
          ? "absolute inset-x-0 top-0 bg-gradient-to-b from-black/60 via-black/15 to-transparent"
          : "sticky top-0 border-b border-border bg-background/95 backdrop-blur"
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center gap-4 px-4 py-3",
          isHome && "text-white"
        )}
      >
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn("lg:hidden", isHome && "hover:bg-white/10")}
              aria-label="Abrir menu"
            >
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col gap-6">
            <SheetHeader>
              <SheetTitle className="font-display text-xl text-accent">{storeConfig.name}</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1">
              <SheetClose asChild>
                <Link href="/" className="rounded-md px-2 py-2 text-sm font-medium hover:bg-secondary">
                  Início
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/produtos" className="rounded-md px-2 py-2 text-sm font-medium hover:bg-secondary">
                  Todos os produtos
                </Link>
              </SheetClose>
              {topLevel.map((category) => (
                <SheetClose asChild key={category.id}>
                  <Link
                    href={`/categoria/${category.slug}`}
                    className="rounded-md px-2 py-2 text-sm hover:bg-secondary"
                  >
                    {category.name}
                  </Link>
                </SheetClose>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <Link href="/" aria-label={storeConfig.name}>
          <Image
            src="/logo.png"
            alt={storeConfig.name}
            width={44}
            height={44}
            priority
            className="size-9 rounded-full sm:size-11"
          />
        </Link>

        <nav className="hidden items-center gap-5 lg:flex">
          {topLevel.slice(0, 8).map((category) => (
            <Link
              key={category.id}
              href={`/categoria/${category.slug}`}
              className={cn(
                "text-sm font-medium",
                isHome ? "text-white/90 hover:text-white" : "text-foreground/80 hover:text-accent"
              )}
            >
              {category.name}
            </Link>
          ))}
        </nav>

        <form onSubmit={handleSearch} className="ml-auto hidden max-w-sm flex-1 items-center gap-2 md:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="q"
              placeholder="Buscar produtos ou código"
              className={cn("pl-9", isHome && "border-transparent bg-white/95 text-foreground")}
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn("md:hidden", isHome && "hover:bg-white/10")}
            aria-label="Buscar"
            onClick={() => setMobileSearchOpen((open) => !open)}
          >
            <Search />
          </Button>
          <CartSheet light={isHome} />
        </div>
      </div>

      {mobileSearchOpen && (
        <div
          className={cn(
            "border-t px-4 py-2 md:hidden",
            isHome ? "border-white/10 bg-black/70 backdrop-blur" : "border-border bg-background"
          )}
        >
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <Input
              ref={mobileSearchRef}
              name="q"
              placeholder="Buscar produtos ou código"
              className={cn("flex-1", isHome && "border-transparent bg-white/95 text-foreground")}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Fechar busca"
              onClick={() => setMobileSearchOpen(false)}
              className={cn(isHome && "text-white hover:bg-white/10")}
            >
              <X />
            </Button>
          </form>
        </div>
      )}
    </header>
  );
}
