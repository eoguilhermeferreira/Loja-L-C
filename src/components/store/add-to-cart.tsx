"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, Zap } from "lucide-react";
import { toast } from "sonner";

import { useCart } from "@/components/cart/cart-provider";
import { VariationSheet } from "@/components/store/variation-sheet";
import { Button } from "@/components/ui/button";
import { getVariationModel } from "@/lib/variations";
import type { ProductVariation, ProductWithRelations } from "@/types/database.types";

export function AddToCart({ product }: { product: ProductWithRelations }) {
  const router = useRouter();
  const { addItem } = useCart();
  const model = getVariationModel(product.product_variations);
  const hasVariations = model.mode !== "none";

  const [quantity, setQuantity] = React.useState(1);
  const [sheetAction, setSheetAction] = React.useState<"cart" | "buy" | null>(null);

  const stock = product.stock;
  const anyStock = hasVariations ? product.product_variations.some((v) => v.stock > 0) : stock > 0;
  const canBuy = product.is_active && anyStock;
  const unitPrice = product.promo_price ?? product.price;

  function addToCart(variation: ProductVariation | null, qty: number) {
    const isCombo = model.mode === "combo";
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        imageUrl: product.product_images[0]?.url ?? null,
        unitPrice,
        weightGrams: product.weight_grams,
        maxStock: variation ? variation.stock : stock,
        variationId: variation?.id,
        variationLabel: variation
          ? isCombo
            ? "Tamanho / Cor"
            : variation.label
          : undefined,
        variationValue: variation
          ? isCombo && variation.value
            ? `${variation.label} / ${variation.value}`
            : variation.value || variation.label
          : undefined,
      },
      qty
    );
  }

  function handleAdd() {
    if (!canBuy) return;
    if (hasVariations) {
      setSheetAction("cart");
      return;
    }
    addToCart(null, quantity);
    toast.success("Adicionado ao carrinho", { description: product.name });
  }

  function handleBuyNow() {
    if (!canBuy) return;
    if (hasVariations) {
      setSheetAction("buy");
      return;
    }
    addToCart(null, quantity);
    router.push("/checkout");
  }

  function handleConfirmVariation(variation: ProductVariation, qty: number) {
    addToCart(variation, qty);
    if (sheetAction === "buy") {
      router.push("/checkout");
    } else {
      toast.success("Adicionado ao carrinho", { description: product.name });
    }
    setSheetAction(null);
  }

  return (
    <div className="flex flex-col gap-4">
      {canBuy ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            {!hasVariations && (
              <div className="flex items-center rounded-md border border-input">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  <Minus className="size-4" />
                </Button>
                <span className="w-8 text-center text-sm">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                >
                  <Plus className="size-4" />
                </Button>
              </div>
            )}
            <Button size="lg" variant="outline" className="flex-1" onClick={handleAdd}>
              <ShoppingBag /> Adicionar ao carrinho
            </Button>
          </div>
          <Button size="lg" className="w-full" onClick={handleBuyNow}>
            <Zap /> Comprar agora
          </Button>
        </div>
      ) : (
        <Button size="lg" disabled className="w-full">
          {product.is_active ? "Sem estoque" : "Produto indisponível"}
        </Button>
      )}

      {!hasVariations && canBuy && stock <= 5 && (
        <p className="text-xs text-accent-foreground/80">Últimas {stock} unidades!</p>
      )}

      {hasVariations && (
        <VariationSheet
          key={sheetAction ?? "none"}
          product={product}
          open={sheetAction !== null}
          onOpenChange={(open) => !open && setSheetAction(null)}
          actionLabel={sheetAction === "buy" ? "Comprar agora" : "Adicionar ao carrinho"}
          onConfirm={handleConfirmVariation}
        />
      )}
    </div>
  );
}
