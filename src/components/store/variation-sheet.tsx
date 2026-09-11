"use client";

import Image from "next/image";
import * as React from "react";
import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  findComboVariation,
  getVariationModel,
  isColorEnabled,
  isSizeEnabled,
} from "@/lib/variations";
import type { ProductVariation, ProductWithRelations } from "@/types/database.types";

export function VariationSheet({
  product,
  open,
  onOpenChange,
  actionLabel,
  onConfirm,
}: {
  product: ProductWithRelations;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actionLabel: string;
  onConfirm: (variation: ProductVariation, quantity: number) => void;
}) {
  const variations = product.product_variations;
  const model = React.useMemo(() => getVariationModel(variations), [variations]);

  const [size, setSize] = React.useState<string | null>(null);
  const [color, setColor] = React.useState<string | null>(null);
  const [quantity, setQuantity] = React.useState(1);

  const selected: ProductVariation | undefined = React.useMemo(() => {
    if (model.mode === "single") {
      return size ? variations.find((v) => v.value === size) : undefined;
    }
    if (model.mode === "combo") {
      if (!size) return undefined;
      if (model.colors.length > 0 && !color) return undefined;
      return findComboVariation(variations, size, color);
    }
    return undefined;
  }, [model, variations, size, color]);

  const stock = selected?.stock ?? 0;
  const unitPrice = product.promo_price ?? product.price;

  function handleSelectSize(value: string) {
    setSize(value);
    setQuantity(1);
    if (model.mode === "combo" && color && !isColorEnabled(variations, color, value)) {
      setColor(null);
    }
  }

  function handleSelectColor(value: string) {
    setColor(value);
    setQuantity(1);
    if (size && !isSizeEnabled(variations, size, value)) {
      setSize(null);
    }
  }

  function handleConfirm() {
    if (!selected || stock <= 0) return;
    onConfirm(selected, quantity);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="mx-auto flex max-h-[85vh] w-full max-w-lg flex-col gap-4 overflow-y-auto rounded-t-2xl"
      >
        <SheetHeader>
          <div className="flex items-center gap-3">
            <div className="relative size-16 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
              {product.product_images[0] && (
                <Image
                  src={product.product_images[0].url}
                  alt=""
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div>
              <SheetTitle className="font-display text-lg text-primary">
                {formatPrice(unitPrice)}
              </SheetTitle>
              <p className="text-xs text-muted-foreground">
                {selected ? `Estoque: ${stock}` : "Selecione as opções"}
              </p>
            </div>
          </div>
        </SheetHeader>

        <div className="flex flex-col gap-4">
          {model.mode === "single" && (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">{model.axisLabel}</span>
              <div className="flex flex-wrap gap-2">
                {variations.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => v.stock > 0 && handleSelectSize(v.value)}
                    disabled={v.stock <= 0}
                    className={cn(
                      "rounded-md border px-3 py-1.5 text-sm transition-colors",
                      size === v.value
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input hover:bg-secondary",
                      v.stock <= 0 && "cursor-not-allowed opacity-40 line-through"
                    )}
                  >
                    {v.value}
                  </button>
                ))}
              </div>
            </div>
          )}

          {model.mode === "combo" && model.colors.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">Cor</span>
              <div className="flex flex-wrap gap-2">
                {model.colors.map((c) => {
                  const enabled = isColorEnabled(variations, c, size);
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => enabled && handleSelectColor(c)}
                      disabled={!enabled}
                      className={cn(
                        "rounded-md border px-3 py-1.5 text-sm transition-colors",
                        color === c
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-input hover:bg-secondary",
                        !enabled && "cursor-not-allowed opacity-40 line-through"
                      )}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {model.mode === "combo" && (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">Tamanho</span>
              <div className="flex flex-wrap gap-2">
                {model.sizes.map((s) => {
                  const enabled = isSizeEnabled(variations, s, color);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => enabled && handleSelectSize(s)}
                      disabled={!enabled}
                      className={cn(
                        "rounded-md border px-3 py-1.5 text-sm transition-colors",
                        size === s
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-input hover:bg-secondary",
                        !enabled && "cursor-not-allowed opacity-40 line-through"
                      )}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Quantidade</span>
            <div className="flex items-center rounded-md border border-input">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={!selected}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Minus className="size-4" />
              </Button>
              <span className="w-8 text-center text-sm">{quantity}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={!selected}
                onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
              >
                <Plus className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        <Button size="lg" className="w-full" disabled={!selected || stock <= 0} onClick={handleConfirm}>
          {actionLabel}
        </Button>
      </SheetContent>
    </Sheet>
  );
}
