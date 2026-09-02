"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { cn } from "@/lib/utils";
import type { Banner } from "@/types/database.types";

/**
 * Slide de vídeo: tudo (forçar muted, tentar play, e os listeners de
 * retomada) roda num único callback ref, sem gap pra useEffect — iOS só
 * libera autoplay se o vídeo já estiver mudo antes da 1ª pintura, e um
 * gap entre "vídeo montado" e "listener plugado" pode perder o único
 * disparo de loadeddata/canplay em conexões mais lentas (comum no
 * celular, com o vídeo abaixo da dobra). Sem loop — ao terminar, avisa
 * o carrossel pra avançar.
 */
function VideoSlide({ src, onEnded }: { src: string; onEnded: () => void }) {
  function setVideoRef(node: HTMLVideoElement | null) {
    if (!node) return;

    node.defaultMuted = true;
    node.muted = true;
    node.setAttribute("muted", "");

    function resume() {
      node?.play().catch(() => {});
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") resume();
    }

    resume();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    node.addEventListener("pause", resume);
    node.addEventListener("loadeddata", resume);
    node.addEventListener("canplay", resume);
    node.addEventListener("stalled", resume);
    node.addEventListener("suspend", resume);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      node.removeEventListener("pause", resume);
      node.removeEventListener("loadeddata", resume);
      node.removeEventListener("canplay", resume);
      node.removeEventListener("stalled", resume);
      node.removeEventListener("suspend", resume);
    };
  }

  return (
    <video
      ref={setVideoRef}
      src={src}
      autoPlay
      muted
      playsInline
      preload="auto"
      onEnded={onEnded}
      className="absolute inset-0 size-full object-cover"
    />
  );
}

export function BannerCarousel({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = React.useState(0);

  // O(s) banner(s) de vídeo sempre vêm primeiro, na frente do carrossel
  // de imagens — independe da ordem de exibição configurada no admin.
  const slides = React.useMemo(() => {
    const videos = banners.filter((b) => b.placement === "video" && b.video_url);
    const rest = banners.filter((b) => b.placement !== "video");
    return [...videos, ...rest];
  }, [banners]);

  const advance = React.useCallback(() => {
    setIndex((current) => (current + 1) % slides.length);
  }, [slides.length]);

  React.useEffect(() => {
    if (slides.length < 2) return;
    if (slides[index]?.placement === "video") return;

    const timer = setTimeout(advance, 6000);
    return () => clearTimeout(timer);
  }, [index, slides, advance]);

  if (slides.length === 0) return null;

  const banner = slides[index] ?? slides[0];
  const isVideo = banner.placement === "video";

  const slideContent = (
    <>
      {isVideo && banner.video_url ? (
        <VideoSlide src={banner.video_url} onEnded={advance} />
      ) : banner.image_url ? (
        <Image
          src={banner.image_url}
          alt={banner.title ?? ""}
          fill
          priority={index === 0}
          sizes="100vw"
          className="object-cover"
        />
      ) : null}
      {(banner.eyebrow || banner.title || banner.description || banner.button_label) && (
        <div className="absolute inset-0 flex flex-col justify-end gap-2 bg-gradient-to-t from-black/60 via-black/10 to-transparent p-6 sm:p-10">
          {banner.eyebrow && (
            <span className="text-xs font-semibold uppercase tracking-wide text-accent">
              {banner.eyebrow}
            </span>
          )}
          {banner.title && (
            <h2 className="font-display text-2xl font-semibold text-white sm:text-4xl">
              {banner.title}
            </h2>
          )}
          {banner.description && (
            <p className="max-w-md text-sm text-white/90 sm:text-base">{banner.description}</p>
          )}
          {banner.button_label && (
            <span className="mt-2 inline-flex w-fit items-center rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground">
              {banner.button_label}
            </span>
          )}
        </div>
      )}
    </>
  );

  return (
    <div className="relative w-full overflow-hidden bg-muted">
      {!isVideo && banner.button_link ? (
        <Link
          href={banner.button_link}
          className="relative block aspect-[4/5] w-full sm:aspect-[21/9]"
        >
          {slideContent}
        </Link>
      ) : (
        <div className="relative block aspect-[4/5] w-full sm:aspect-[21/9]">{slideContent}</div>
      )}

      {slides.length > 1 && (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {slides.map((s, i) => (
            <button
              key={s.id}
              aria-label={`Ir para o slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index ? "w-6 bg-white" : "w-1.5 bg-white/50"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
