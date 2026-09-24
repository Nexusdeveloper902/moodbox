"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { QtyStepper } from "./QtyStepper";
import { cart, draft } from "@/lib/store";
import { formatCOP } from "@/lib/format";

/** Price, quantity and CTAs on the MoodBox detail page. */
export function BoxActions({ slug, name, price, prefill }: {
  slug: string; name: string; price: number; prefill: string[];
}) {
  const [qty, setQty] = useState(1);
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between gap-4 border-t border-line pt-6">
        <div>
          <p className="box-ink font-serif text-[40px] leading-none font-semibold md:text-5xl">{formatCOP(price)}</p>
          <p className="mt-2 text-sm text-muted">COP · envío incluido</p>
        </div>
        <QtyStepper value={qty} onChange={setQty} label="Cantidad" />
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button type="button" className="btn bg-box-accent text-white shadow-[0_12px_26px_rgb(46_34_48/0.15)] hover:brightness-95"
          onClick={() => cart.add({ kind: "moodbox", slug, quantity: qty }, { title: "¡Listo! Agregamos tu MoodBox al carrito", detail: `${name} · ${formatCOP(price * qty)}` })}>
          Agregar al carrito
        </button>
        <button type="button" className="btn-outline"
          onClick={() => { draft.load(prefill.map((s) => ({ slug: s, quantity: 1 }))); router.push("/personaliza"); }}>
          Personalizar esta caja
        </button>
      </div>
    </>
  );
}
