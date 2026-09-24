"use client";
import { useState } from "react";
import { QtyStepper } from "./QtyStepper";
import type { Product } from "@/lib/data";
import { formatCOP } from "@/lib/format";
import { MAX_BOX_ITEMS } from "@/lib/pricing";
import { cart, draft, draftCount, useStore } from "@/lib/store";

export function ProductActions({ product: p }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const { draft: d } = useStore();
  const inBox = d.items.some((i) => i.slug === p.slug);
  const full = !inBox && draftCount(d) >= MAX_BOX_ITEMS;

  if (!p.available) {
    return <p className="rounded-2xl bg-disabled px-5 py-4 font-bold text-muted">Agotado por ahora. Vuelve pronto.</p>;
  }
  return (
    <>
      <div className="flex items-center justify-between gap-4 border-t border-line pt-6">
        <div>
          <p className="font-serif text-[40px] leading-none font-semibold text-ink md:text-5xl">{formatCOP(p.price)}</p>
          <p className="mt-2 text-sm text-muted">COP</p>
        </div>
        <QtyStepper value={qty} onChange={setQty} label="Cantidad" />
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button type="button" className="btn-primary"
          onClick={() => cart.add({ kind: "product", slug: p.slug, quantity: qty }, { title: "¡Listo! Lo agregamos al carrito", detail: `${p.name} · ${formatCOP(p.price * qty)}` })}>
          Agregar al carrito
        </button>
        <button type="button" className="btn-outline" aria-pressed={inBox} disabled={full} onClick={() => draft.toggle(p.slug)}>
          {inBox ? "Quitar de mi MoodBox" : "Agregar a mi MoodBox"}
        </button>
      </div>
      {full && <p className="mt-3 text-sm text-muted">Tu MoodBox ya tiene {MAX_BOX_ITEMS} productos.</p>}
    </>
  );
}
