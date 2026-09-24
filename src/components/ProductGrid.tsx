"use client";
import Link from "next/link";
import { useState } from "react";
import { BoxFullNotice } from "./BoxFullNotice";
import { Icon } from "./Icon";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/data";
import { formatCOP } from "@/lib/format";
import { MAX_BOX_ITEMS, boxTotal } from "@/lib/pricing";
import { draftCount, useStore } from "@/lib/store";
import { CATEGORIES } from "@/lib/theme";

/** "Tu MoodBox" mini summary shown at the top of /productos. */
export function DraftBadge({ products }: { products: Product[] }) {
  const { draft } = useStore();
  const count = draftCount(draft);
  const total = boxTotal(draft.items, new Map(products.map((p) => [p.slug, p.price])));
  return (
    <div className="flex items-center gap-4 rounded-3xl border-[1.5px] border-line bg-white p-4 lg:min-w-[400px]">
      <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-oat">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/moodbox/cajas/abierta-tu-moodbox.svg" alt="" className="w-[52px]" />
      </span>
      <div className="flex-1">
        <p className="font-bold text-ink">Tu MoodBox</p>
        <p className="text-sm text-muted">{count ? `${count} ${count === 1 ? "producto" : "productos"} · ${formatCOP(total)}` : "Aún no tiene productos"}</p>
      </div>
      <Link href="/personaliza" className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-bold text-white">Ver mi caja <Icon name="arrow" /></Link>
    </div>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState<string | null>(null);
  const [nudge, setNudge] = useState(0);
  const full = draftCount(useStore().draft) >= MAX_BOX_ITEMS;
  const shown = filter ? products.filter((p) => p.category === filter) : products;
  return (
    <>
      {full && <BoxFullNotice className="mb-6" nudge={nudge} action={{ label: "Ver mi caja", href: "/personaliza" }} />}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="-mx-5 flex gap-2 overflow-x-auto [scrollbar-width:none] px-5 pb-1 md:mx-0 md:flex-wrap md:px-0" role="group" aria-label="Filtrar por categoría">
          <button type="button" className="chip" aria-pressed={filter === null} onClick={() => setFilter(null)}>Todos</button>
          {CATEGORIES.map((c) => (
            <button key={c.id} type="button" className="chip" aria-pressed={filter === c.id} onClick={() => setFilter(c.id)}>{c.filter}</button>
          ))}
        </div>
        <p className="text-sm text-muted" aria-live="polite">{shown.length} productos</p>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5">
        {shown.map((p) => <ProductCard key={p.slug} product={p} onFull={() => setNudge((n) => n + 1)} />)}
      </div>
    </>
  );
}
