import { Icon } from "@/components/Icon";

/** Shown while the classifier reads the message. */
export default function ReadingMood() {
  return (
    <div className="wrap grid min-h-[60vh] place-items-center py-16 text-center" role="status" aria-live="polite">
      <div>
        <span className="mx-auto grid size-20 animate-pulse place-items-center rounded-full bg-blush text-coral"><Icon name="heart" size={34} /></span>
        <p className="kicker mt-6 text-[13px] text-coral">Un momento</p>
        <h1 className="h-display mt-3 text-[34px] md:text-5xl">Estamos leyendo lo que escribiste…</h1>
        <p className="mt-3 text-lg text-muted">Buscamos la MoodBox que más se parece a cómo te sientes.</p>
      </div>
    </div>
  );
}
