import Link from "next/link";

import { getCategoryIcon } from "@/lib/category-icons";
import type { Category } from "@/types/database.types";

export function CategoryGrid({ categories }: { categories: Category[] }) {
  const topLevel = categories.filter((c) => !c.parent_id);
  if (topLevel.length === 0) return null;

  return (
    <div className="grid grid-cols-4 gap-4 sm:grid-cols-5 lg:grid-cols-10">
      {topLevel.map((category) => {
        const Icon = getCategoryIcon(category.icon);
        return (
          <Link
            key={category.id}
            href={`/categoria/${category.slug}`}
            className="group flex flex-col items-center gap-2 text-center"
          >
            <span className="flex size-16 items-center justify-center rounded-full border border-border bg-accent/10 text-accent transition-colors group-hover:border-accent group-hover:bg-accent/20 sm:size-20">
              <Icon className="size-7 sm:size-8" />
            </span>
            <span className="text-xs font-medium text-foreground">{category.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
