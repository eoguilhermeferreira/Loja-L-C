"use client";

import { useEffect, useRef } from "react";

/**
 * Navegador pausa vídeos em aba/página em segundo plano (economia de
 * bateria); ao voltar ele fica parado até o clique do usuário. Retoma
 * sozinho assim que a aba volta a ficar visível ou se algo pausar o
 * vídeo — como não tem controles, nenhuma pausa é intencional do usuário.
 */
export function CampaignVideo({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

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

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      video.removeEventListener("pause", resume);
    };
  }, []);

  return (
    <div className="flex justify-center">
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className="max-h-[70vh] w-auto max-w-full rounded-2xl"
      />
    </div>
  );
}
