export function CampaignVideo({ src }: { src: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-muted">
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className="mx-auto h-auto max-h-[70vh] w-full"
      />
    </div>
  );
}
