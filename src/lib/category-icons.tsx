import type { ComponentType } from "react";
import {
  Sparkles,
  SportShoe,
  Smartphone,
  Droplet,
  Watch,
  Headphones,
  Glasses,
  Backpack,
  Gem,
  Shirt,
  ShoppingBag,
  type LucideProps,
} from "lucide-react";

type IconComponent = ComponentType<Pick<LucideProps, "className">>;

const svgDefaults = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Calça — cintura e as duas pernas separadas até a bainha. */
function PantsIcon({ className }: { className?: string }) {
  return (
    <svg {...svgDefaults} className={className}>
      <path d="M7 2 L17 2 L18 21 L13 21 L12 11 L11 21 L6 21 Z" />
      <path d="M7.5 5 L16.5 5" />
    </svg>
  );
}

/** Blusa de frio — gola alta (canelada) + mangas longas + listras de tricô. */
function SweaterIcon({ className }: { className?: string }) {
  return (
    <svg {...svgDefaults} className={className}>
      <path d="M9 1.5 L15 1.5 L15 3 L18 5 L21 11 L18 13 L16 9.5 L16 20 L8 20 L8 9.5 L6 13 L3 11 L6 5 L9 3 Z" />
      <path d="M9.5 15.5 L14.5 15.5" />
      <path d="M9.5 17.5 L14.5 17.5" />
    </svg>
  );
}

/** Vestido — decote, corpo ajustado na cintura e saia evasê. */
function DressIcon({ className }: { className?: string }) {
  return (
    <svg {...svgDefaults} className={className}>
      <path d="M10 2 L14 2 L17 6 L13.5 10 L19 21 L5 21 L10.5 10 L7 6 Z" />
      <path d="M10.5 10.5 L13.5 10.5" />
    </svg>
  );
}

/** Short/bermuda — mesma silhueta da calça, com a perna bem mais curta. */
function ShortsIcon({ className }: { className?: string }) {
  return (
    <svg {...svgDefaults} className={className}>
      <path d="M6 3 L18 3 L19 15 L13 15 L12 9 L11 15 L5 15 Z" />
      <path d="M6.5 5.5 L17.5 5.5" />
    </svg>
  );
}

/** Conjunto — uma blusinha e uma calça lado a lado. */
function OutfitIcon({ className }: { className?: string }) {
  return (
    <svg {...svgDefaults} className={className}>
      <g transform="translate(1,2.2) scale(0.42)">
        <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
      </g>
      <g transform="translate(10.5,2.2) scale(0.42)">
        <path d="M7 2 L17 2 L18 21 L13 21 L12 11 L11 21 L6 21 Z" />
      </g>
    </svg>
  );
}

/**
 * Mapa de nome (salvo em categories.icon) -> componente de ícone.
 * Usado na navegação por categorias da home e do menu.
 */
export const CATEGORY_ICONS: Record<string, IconComponent> = {
  perfumes: Sparkles,
  tenis: SportShoe,
  celulares: Smartphone,
  cremes: Droplet,
  relogios: Watch,
  fones: Headphones,
  oculos: Glasses,
  acessorios: Backpack,
  joias: Gem,
  camiseta: Shirt,
  camisa: Shirt,
  blusa: Shirt,
  "blusa-frio": SweaterIcon,
  calca: PantsIcon,
  short: ShortsIcon,
  conjunto: OutfitIcon,
  vestido: DressIcon,
};

export function getCategoryIcon(name: string | null): IconComponent {
  if (!name) return ShoppingBag;
  return CATEGORY_ICONS[name] ?? ShoppingBag;
}
