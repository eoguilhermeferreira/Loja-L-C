import type { ProductVariation } from "@/types/database.types";

/**
 * Uma linha de variação guarda dois campos livres (label/valor). O modo é
 * inferido a partir dos dados: se todas as linhas repetem o mesmo texto no
 * campo "label", é uma variação de um eixo só (ex: só Tamanho, ou só Cor) e o
 * "label" é o nome do grupo. Se o texto do "label" muda linha a linha, cada
 * linha passa a representar uma combinação específica (ex: Tamanho G + Cor
 * Azul), com estoque próprio por combinação — sem precisar de uma coluna a
 * mais no banco.
 */
export type VariationMode = "none" | "single" | "combo";

export interface VariationModel {
  mode: VariationMode;
  axisLabel: string;
  sizes: string[];
  colors: string[];
}

export function getVariationModel(variations: ProductVariation[]): VariationModel {
  if (variations.length === 0) {
    return { mode: "none", axisLabel: "", sizes: [], colors: [] };
  }

  const uniqueLabels = [...new Set(variations.map((v) => v.label))];
  if (uniqueLabels.length === 1) {
    return { mode: "single", axisLabel: uniqueLabels[0], sizes: [], colors: [] };
  }

  const sizes = [...new Set(variations.map((v) => v.label))];
  const colors = [...new Set(variations.map((v) => v.value.trim()).filter(Boolean))];
  return { mode: "combo", axisLabel: "", sizes, colors };
}

export function findComboVariation(
  variations: ProductVariation[],
  size: string,
  color: string | null
): ProductVariation | undefined {
  return variations.find((v) => v.label === size && (color === null || v.value === color));
}

export function isSizeEnabled(
  variations: ProductVariation[],
  size: string,
  color: string | null
): boolean {
  return variations.some(
    (v) => v.label === size && (color === null || v.value === color) && v.stock > 0
  );
}

export function isColorEnabled(
  variations: ProductVariation[],
  color: string,
  size: string | null
): boolean {
  return variations.some(
    (v) => v.value === color && (size === null || v.label === size) && v.stock > 0
  );
}
