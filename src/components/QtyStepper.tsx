"use client";
import { Icon } from "./Icon";

/** "Selector de cantidad" component. */
export function QtyStepper({ value, onChange, min = 1, max = 20, label, size = "md" }: {
  value: number; onChange: (n: number) => void; min?: number; max?: number; label: string; size?: "sm" | "md";
}) {
  const b = size === "sm" ? "size-7" : "size-8";
  return (
    <div className={`inline-flex items-center rounded-full border-[1.5px] border-line bg-white ${size === "sm" ? "gap-2 p-1" : "gap-3.5 p-1.5"}`} role="group" aria-label={label}>
      <button type="button" onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="Quitar uno"
        className={`grid ${b} place-items-center rounded-full bg-sand text-ink disabled:opacity-40`}>
        <Icon name="minus" />
      </button>
      <span className="min-w-4 text-center text-base font-bold" aria-live="polite">{value}</span>
      <button type="button" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Agregar uno"
        className={`grid ${b} place-items-center rounded-full bg-coral text-white disabled:bg-disabled disabled:text-subtle`}>
        <Icon name="plus" />
      </button>
    </div>
  );
}
