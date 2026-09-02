"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

export function BackButton({
  fallbackHref = "/",
  className,
}: {
  fallbackHref?: string;
  className?: string;
}) {
  const router = useRouter();

  function handleClick() {
    if (window.history.length > 1) router.back();
    else router.push(fallbackHref);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "mb-4 inline-flex w-fit items-center gap-1 self-start text-sm font-medium text-muted-foreground hover:text-accent",
        className
      )}
    >
      <ArrowLeft className="size-4" /> Voltar
    </button>
  );
}
