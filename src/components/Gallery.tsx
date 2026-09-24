"use client";
import { useState, type ReactNode } from "react";

/** Big visual + thumbnails on the MoodBox detail page. */
export function Gallery({ slides, labels }: { slides: ReactNode[]; labels: string[] }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="relative grid aspect-[660/580] place-items-center overflow-hidden rounded-[32px] bg-box-scene">{slides[active]}</div>
      <div className="mt-6 grid grid-cols-4 gap-3 md:gap-[18px]" role="group" aria-label="Imágenes">
        {slides.map((s, i) => (
          <button key={i} type="button" onClick={() => setActive(i)} aria-pressed={active === i} aria-label={labels[i]}
            className={`grid aspect-[150/112] place-items-center overflow-hidden rounded-[18px] bg-[color-mix(in_srgb,var(--box-scene)_60%,transparent)] p-2 transition [&_*]:pointer-events-none ${active === i ? "border-2 border-[var(--box-accent)] bg-box-scene" : "border-2 border-transparent"}`}>
            <div className="h-full w-full scale-100 [&>*]:h-full">{s}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
