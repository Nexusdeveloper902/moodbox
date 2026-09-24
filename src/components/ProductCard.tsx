"use client";
import Link from "next/link";
import { Icon } from "./Icon";
import type { Product } from "@/lib/data";
import { formatCOP } from "@/lib/format";
import { MAX_BOX_ITEMS } from "@/lib/pricing";
import { draft, draftCount, useStore } from "@/lib/store";

/** "Tarjeta de producto": default, selected (Agregado) and sold-out (Agotado) states. */
/** `onFull` runs when someone tries to add to a box with no free slots. */
export function ProductCard({ product: p, onRemove, onFull }: { product: Product; onRemove?: (p: Product) => void; onFull?: () => void }) {
  const { draft: d } = useStore();
  const selected = d.items.some((i) => i.slug === p.slug);
  const full = !selected && draftCount(d) >= MAX_BOX_ITEMS;
  const soldOut = !p.available;

  const toggle = () => (full ? onFull?.() : selected && onRemove ? onRemove(p) : draft.toggle(p.slug));

  return (
    <article className={`relative flex flex-col gap-3.5 rounded-[22px] bg-white p-2 pb-4 transition md:p-2.5 md:pb-4 ${full ? "opacity-60" : ""} ${selected ? "border-[2.5px] border-coral shadow-selected" : "border-[1.5px] border-line shadow-soft"}`}>
      <div className={`relative grid aspect-[220/160] place-items-center rounded-2xl ${selected ? "bg-blush" : "bg-sand"}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.image} alt="" className={`size-[70%] md:size-[75%] ${soldOut ? "opacity-60" : ""}`} />
        {soldOut && <span className="absolute top-2 left-2 rounded-full bg-disabled px-3 py-1.5 text-[13px] font-bold text-muted">Agotado</span>}
        {selected && <span className="absolute top-2.5 right-2.5 hidden size-[30px] place-items-center rounded-full bg-coral text-white md:grid"><Icon name="check" size={18} /></span>}
      </div>
      <div className="px-1.5">
        <h3 className={`text-[15px] font-bold md:text-[17px] ${soldOut ? "text-muted" : "text-ink"}`}>
          <Link href={`/productos/${p.slug}`} className="hover:underline">{p.name}</Link>
        </h3>
        <p className="mt-1 hidden text-sm text-muted md:block">{p.description}</p>
      </div>
      <div className="mt-auto flex items-center justify-between px-1.5">
        <p className={`text-[15px] font-bold md:text-[17px] ${soldOut ? "text-subtle" : "text-ink"}`}>{soldOut ? <><span className="md:hidden">Agotado</span><span className="hidden md:inline">{formatCOP(p.price)}</span></> : formatCOP(p.price)}</p>
        {soldOut ? (
          <span className="grid size-11 place-items-center rounded-full bg-disabled text-subtle md:size-auto md:px-3.5 md:py-2 md:text-sm md:font-bold" aria-label="Agotado">
            <Icon name="plus" className="md:hidden" /><span className="hidden md:inline">Agotado</span>
          </span>
        ) : (
          <button type="button" onClick={toggle} aria-pressed={selected} aria-disabled={full || undefined}
            aria-label={selected ? `Quitar ${p.name} de tu MoodBox` : full ? `${p.name}: tu MoodBox está llena` : `Agregar ${p.name} a tu MoodBox`}
            className={`grid size-11 place-items-center rounded-full text-sm font-bold transition md:flex md:size-auto md:gap-1.5 md:px-3.5 md:py-2 ${
              selected ? "bg-coral text-white" : full ? "cursor-not-allowed border-[1.5px] border-line bg-sand text-subtle" : "border-[1.5px] border-ink bg-white text-ink hover:bg-blush"}`}>
            <Icon name={selected ? "check" : full ? "lock" : "plus"} size={selected ? 16 : 14} />
            <span className="hidden md:inline">{selected ? "Agregado" : full ? "Caja llena" : "Agregar"}</span>
          </button>
        )}
      </div>
    </article>
  );
}
