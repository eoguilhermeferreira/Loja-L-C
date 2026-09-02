"use client";

import { useEffect, useRef } from "react";

/**
 * iOS Safari só libera autoplay se o vídeo já estiver mudo antes do
 * primeiro paint — o atributo JSX `muted` do React nem sempre chega a
 * tempo no HTML inicial, então força a propriedade/atributo no próprio
 * callback ref (roda antes da pintura, mais cedo que um useEffect).
 * Some isso ao fato de o vídeo ficar abaixo da dobra no mobile (o
 * navegador adia o carregamento) e o navegador pausa vídeos em
 * aba/página em segundo plano — por isso os vários pontos de retomada
 * abaixo (loadeddata, canplay, pause, visibilitychange). Como não tem
 * controles, nenhuma pausa é intencional do usuário.
 */
export function CampaignVideo({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  function setVideoRef(node: HTMLVideoElement | null) {
    videoRef.current = node;
    if (!node) return;
    node.defaultMuted = true;
    node.muted = true;
    node.setAttribute("muted", "");
    node.play().catch(() => {});
  }

  useEffect(() => {
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
    <div className="flex justify-center">
      <video
        ref={setVideoRef}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="max-h-[70vh] w-auto max-w-full rounded-2xl"
      />
    </div>
  );
}
