"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { cn } from "@/lib/utils";
import type { Banner } from "@/types/database.types";

type Slide = { type: "video"; src: string } | { type: "banner"; banner: Banner };

/**
 * Slide de vídeo: muted forçado antes da pintura via callback ref (iOS
 * só libera autoplay assim) e retomada em loadeddata/canplay/pause/
 * visibilitychange. Sem loop — ao terminar, avisa o carrossel pra
 * avançar pro próximo slide.
 */
function VideoSlide({ src, onEnded }: { src: string; onEnded: () => void }) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  function setVideoRef(node: HTMLVideoElement | null) {
    videoRef.current = node;
    if (!node) return;
    node.defaultMuted = true;
    node.muted = true;
    node.setAttribute("muted", "");
    node.play().catch(() => {});
  }

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    function resume() {
      video?.play().catch(() => {});
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") resume();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    video.addEventListener("pause", resume);
    video.addEventListener("loadeddata", resume);
    video.addEventListener("canplay", resume);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      video.removeEventListener("pause", resume);
      video.removeEventListener("loadeddata", resume);
      video.removeEventListener("canplay", resume);
    };
  }, []);

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

export function BannerCarousel({
  banners,
  videoSrc,
}: {
  banners: Banner[];
  videoSrc?: string;
}) {
  const [index, setIndex] = React.useState(0);

  const slides = React.useMemo<Slide[]>(() => {
    const bannerSlides: Slide[] = banners.map((banner) => ({ type: "banner", banner }));
    return videoSrc ? [{ type: "video", src: videoSrc }, ...bannerSlides] : bannerSlides;
  }, [banners, videoSrc]);

  const advance = React.useCallback(() => {
    setIndex((current) => (current + 1) % slides.length);
  }, [slides.length]);

  React.useEffect(() => {
    if (slides.length < 2) return;
    if (slides[index]?.type === "video") return;

    const timer = setTimeout(advance, 6000);
    return () => clearTimeout(timer);
  }, [index, slides, advance]);

  if (slides.length === 0) return null;

  const slide = slides[index] ?? slides[0];

  const slideContent =
    slide.type === "video" ? (
      <VideoSlide src={slide.src} onEnded={advance} />
    ) : (
      <>
        <Image
          src={slide.banner.image_url}
          alt={slide.banner.title ?? ""}
          fill
          priority={index === 0}
          sizes="100vw"
          className="object-cover"
        />
        {(slide.banner.title || slide.banner.description || slide.banner.button_label) && (
          <div className="absolute inset-0 flex flex-col justify-end gap-2 bg-gradient-to-t from-black/60 via-black/10 to-transparent p-6 sm:p-10">
            {slide.banner.title && (
              <h2 className="font-display text-2xl font-semibold text-white sm:text-4xl">
                {slide.banner.title}
              </h2>
            )}
            {slide.banner.description && (
              <p className="max-w-md text-sm text-white/90 sm:text-base">
                {slide.banner.description}
              </p>
            )}
            {slide.banner.button_label && (
              <span className="mt-2 inline-flex w-fit items-center rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground">
                {slide.banner.button_label}
              </span>
            )}
          </div>
        )}
      </>
    );

  return (
    <div className="relative w-full overflow-hidden bg-muted">
      {slide.type === "banner" && slide.banner.button_link ? (
        <Link
          href={slide.banner.button_link}
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
              key={s.type === "video" ? "video" : s.banner.id}
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
