import {
  Sparkles,
  Footprints,
  Smartphone,
  Droplet,
  Watch,
  Headphones,
  Glasses,
  Backpack,
  Gem,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";

/**
 * Mapa de nome (salvo em categories.icon) -> componente de ícone.
 * Usado na navegação por categorias da home e do menu.
 */
export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  perfumes: Sparkles,
  tenis: Footprints,
  celulares: Smartphone,
  cremes: Droplet,
  relogios: Watch,
  fones: Headphones,
  oculos: Glasses,
  acessorios: Backpack,
  joias: Gem,
};

export function getCategoryIcon(name: string | null): LucideIcon {
  if (!name) return ShoppingBag;
  return CATEGORY_ICONS[name] ?? ShoppingBag;
}
