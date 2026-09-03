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
          isHome && "text-white",
          mobileSearchOpen && "hidden md:flex"
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
            <SheetHeader className="flex-row items-center gap-3">
              <Image src="/logo.png" alt="" width={56} height={56} className="size-14 rounded-full" />
              <SheetTitle className="font-display text-lg text-accent">{storeConfig.name}</SheetTitle>
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

        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt=""
            width={56}
            height={56}
            priority
            className="size-11 rounded-full sm:size-14"
          />
          <span
            className={cn(
              "font-display text-lg font-semibold tracking-tight sm:text-xl",
              isHome ? "text-white" : "text-accent"
            )}
          >
            {storeConfig.name}
          </span>
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
            <button
              type="submit"
              aria-label="Buscar"
              className="absolute left-0 top-0 flex h-full w-9 items-center justify-center text-muted-foreground"
            >
              <Search className="size-4" />
            </button>
            <Input
              name="q"
              type="search"
              enterKeyHint="search"
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
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 md:hidden">
          <form onSubmit={handleSearch} className="flex flex-1 items-center gap-2">
            <button
              type="submit"
              aria-label="Buscar"
              className={cn("shrink-0", isHome ? "text-white" : "text-muted-foreground")}
            >
              <Search className="size-5" />
            </button>
            <Input
              ref={mobileSearchRef}
              name="q"
              type="search"
              enterKeyHint="search"
              placeholder="Buscar produtos ou código"
              className={cn("flex-1", isHome && "border-transparent bg-white/95 text-foreground")}
            />
          </form>
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
        </div>
      )}
    </header>
  );
}
