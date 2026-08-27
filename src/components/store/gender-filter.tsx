import Link from "next/link";

import { cn } from "@/lib/utils";

const OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Todos" },
  { value: "feminino", label: "Feminino" },
  { value: "masculino", label: "Masculino" },
];

export function GenderFilter({
  basePath,
  currentGender,
  extraParams,
}: {
  basePath: string;
  currentGender?: string;
  extraParams?: Record<string, string | undefined>;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {OPTIONS.map((option) => {
        const active = (currentGender ?? "") === option.value;
        const query: Record<string, string> = {};
        for (const [key, value] of Object.entries(extraParams ?? {})) {
          if (value) query[key] = value;
        }
        if (option.value) query.genero = option.value;

        return (
          <Link
            key={option.value || "todos"}
            href={{ pathname: basePath, query }}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              active
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border text-foreground/70 hover:border-accent hover:text-accent"
            )}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}
