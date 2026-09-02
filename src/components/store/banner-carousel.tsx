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
 *
 * Importante: iOS bloqueia autoplay de qualquer vídeo (mesmo mudo) com
 * o Modo de Baixa Energia ou "Reduzir Movimento" ativados, e nesse caso
 * desenha um ícone de play grande por cima do vídeo — UI nativa do
 * WebKit que o CSS da página não consegue esconder de forma confiável
 * (varia entre versões do iOS). Por isso o vídeo fica com opacidade 0
 * até o evento onPlaying confirmar que ele está realmente tocando; até
 * lá, e enquanto não tocar, mostra a capa (primeiro quadro do vídeo)
 * por cima — a opacidade 0 esconde a caixa inteira do vídeo, ícone
 * nativo incluso, então nunca aparece um botão de play; o que aparece é
 * só uma foto parada. O toque continua chegando no vídeo (a capa tem
 * pointer-events-none), então dá pra iniciar manualmente mesmo
 * invisível. O vídeo NUNCA fica dentro do Link do slide (o toque nativo
 * do Safari pra iniciar o vídeo engolia o clique antes de chegar no
 * botão) — só o botão "Ver coleção" é um link de verdade, sempre
 * clicável.
 */
function VideoSlide({
  src,
  poster,
  onEnded,
}: {
  src: string;
  poster: string | null;
  onEnded: () => void;
}) {
  const [started, setStarted] = React.useState(false);

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
    <>
      <video
        ref={setVideoRef}
        src={src}
        poster={poster ?? undefined}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={onEnded}
        onPlaying={() => setStarted(true)}
        className={cn(
          "absolute inset-0 size-full object-cover transition-opacity duration-500",
          started ? "opacity-100" : "opacity-0"
        )}
      />
      {poster && (
        <Image
          src={poster}
          alt=""
          fill
          priority
          sizes="100vw"
          aria-hidden
          className={cn(
            "object-cover pointer-events-none transition-opacity duration-500",
            started ? "opacity-0" : "opacity-100"
          )}
        />
      )}
    </>
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

  const media =
    isVideo && banner.video_url ? (
      <VideoSlide src={banner.video_url} poster={banner.image_url} onEnded={advance} />
    ) : banner.image_url ? (
      <Image
        src={banner.image_url}
        alt={banner.title ?? ""}
        fill
        priority={index === 0}
        sizes="100vw"
        className="object-cover"
      />
    ) : null;

  const hasText = banner.eyebrow || banner.title || banner.description || banner.button_label;

  const textOverlay = hasText && (
    <div
      className={cn(
        "absolute inset-0 flex flex-col justify-end gap-2 bg-gradient-to-t from-black/60 via-black/10 to-transparent p-6 sm:p-10",
        isVideo && "pointer-events-none"
      )}
    >
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
      {banner.button_label &&
        (isVideo && banner.button_link ? (
          <Link
            href={banner.button_link}
            className="pointer-events-auto mt-2 inline-flex w-fit items-center rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
          >
            {banner.button_label}
          </Link>
        ) : (
          <span className="mt-2 inline-flex w-fit items-center rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground">
            {banner.button_label}
          </span>
        ))}
    </div>
  );

  const slideBody = (
    <>
      {media}
      {textOverlay}
    </>
  );

  return (
    <div className="relative w-full overflow-hidden bg-muted">
      {!isVideo && banner.button_link ? (
        <Link
          href={banner.button_link}
          className="relative block aspect-[4/5] w-full sm:aspect-[21/9]"
        >
          {slideBody}
        </Link>
      ) : (
        <div className="relative block aspect-[4/5] w-full sm:aspect-[21/9]">{slideBody}</div>
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
