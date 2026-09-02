export function CampaignVideo({ src }: { src: string }) {
  return (
    <div className="flex justify-center">
      <video
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
