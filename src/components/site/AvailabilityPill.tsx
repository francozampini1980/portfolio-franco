export function AvailabilityPill({ text }: { text: string }) {
  if (!text) return null;
  return (
    <p className="inline-flex w-full items-center gap-2 rounded-pill border border-violet-500/40 px-4 py-2 text-sm leading-[22px] text-fg sm:w-auto">
      <span
        aria-hidden
        className="h-2 w-2 shrink-0 rounded-full bg-green-400"
      />
      {text}
    </p>
  );
}
