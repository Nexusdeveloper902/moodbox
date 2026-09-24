"use client";
import { useRef } from "react";
import { Icon } from "./Icon";

const SUGGESTIONS = ["Tuve un día difícil", "Necesito descansar", "Quiero consentir a alguien"];

/** "Campo de estado de ánimo": free text + suggestion chips, submitted to /resultado. */
export function MoodForm({ defaultValue = "" }: { defaultValue?: string }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  return (
    <form action="/resultado" className="flex flex-col gap-5 rounded-[32px] bg-white p-[18px] shadow-float md:px-7 md:pt-7 md:pb-6">
      <label htmlFor="q" className="hidden items-center gap-2 text-[15px] font-semibold text-muted md:flex">
        <Icon name="heart" className="text-coral" /> Escríbelo como se lo contarías a un amigo
      </label>
      <textarea
        ref={ref} id="q" name="q" required maxLength={500} rows={3} defaultValue={defaultValue}
        aria-label="¿Cómo te sientes hoy?"
        placeholder="“Hoy tuve un día muy pesado y quiero desconectarme un rato…”"
        className="min-h-[120px] w-full resize-none rounded-[20px] bg-sand px-5 py-[18px] text-lg leading-[1.45] text-ink outline-none placeholder:text-ink/80 focus:ring-2 focus:ring-coral md:min-h-[130px] md:text-[22px]"
      />
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Sugerencias">
          {SUGGESTIONS.map((s, i) => (
            <button key={s} type="button" onClick={() => { if (ref.current) { ref.current.value = s; ref.current.focus(); } }}
              className={`rounded-full border-[1.5px] border-line bg-white px-3.5 py-2 text-[13px] font-medium text-ink hover:border-ink ${i === 2 ? "hidden sm:inline-flex" : ""}`}>
              {s}
            </button>
          ))}
        </div>
        <button type="submit" className="btn-primary w-full md:w-auto">Encontrar mi MoodBox</button>
      </div>
    </form>
  );
}
