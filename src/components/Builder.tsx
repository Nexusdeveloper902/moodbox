"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { BoxFullNotice } from "./BoxFullNotice";
import { Icon } from "./Icon";
import { ProductCard } from "./ProductCard";
import { QtyStepper } from "./QtyStepper";
import type { Product } from "@/lib/data";
import { formatCOP } from "@/lib/format";
import { MAX_BOX_ITEMS, MAX_MESSAGE, boxTotal } from "@/lib/pricing";
import { draft, draftCount, useStore } from "@/lib/store";
import { CATEGORIES } from "@/lib/theme";

const FEMININE = new Set(["gomitas", "bebida-fria", "pulsera", "vela", "carta", "tarjeta"]);
const article = (p: Product) => (p.slug === "gomitas" ? "las" : FEMININE.has(p.slug) ? "la" : "el");

export function Builder({ products, art, prefill }: { products: Product[]; art: ReactNode; prefill: string[] | null }) {
  const router = useRouter();
  const { draft: d } = useStore();
  const [filter, setFilter] = useState<string | null>(null);
  const [removing, setRemoving] = useState<Product | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [nudge, setNudge] = useState(0);

  // /personaliza?desde=<box> starts from that box's products.
  useEffect(() => {
    if (!prefill) return;
    draft.load(prefill.map((slug) => ({ slug, quantity: 1 })));
    router.replace("/personaliza", { scroll: false });
  }, [prefill, router]);

  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const prices = new Map(products.map((p) => [p.slug, p.price]));
  const count = draftCount(d);
  const total = boxTotal(d.items, prices);
  const hasLetter = d.items.some((i) => i.slug === "carta");
  const full = count >= MAX_BOX_ITEMS;
  const left = MAX_BOX_ITEMS - count;
  const onFull = () => setNudge((n) => n + 1);
  const slotsBadge = (
    <span className={`rounded-full px-2.5 py-1 text-xs font-bold whitespace-nowrap ${full ? "bg-coral text-white" : "bg-blush text-coral"}`}>
      {full ? "¡Llena! " : ""}{count} de {MAX_BOX_ITEMS} espacios
    </span>
  );
  const carta = bySlug.get("carta")!;

  const commit = () => {
    draft.commit({ title: "¡Listo! Agregamos tu MoodBox al carrito", detail: `Tu MoodBox · ${formatCOP(total)}` });
    router.push("/carrito");
  };

  const summary = (
    <>
      <ul className="flex flex-col gap-2.5">
        {d.items.map((item) => {
          const p = bySlug.get(item.slug);
          if (!p) return null;
          return (
            <li key={item.slug} className="flex items-center gap-3 rounded-2xl bg-cream px-2.5 py-2">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt="" className="size-9" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-bold text-ink">{p.name}</p>
                {p.slug === "carta"
                  ? <p className="text-xs text-muted">Cantidad: 1</p>
                  : <QtyStepper size="sm" value={item.quantity} label={`Cantidad de ${p.name}`}
                      max={MAX_BOX_ITEMS - count + item.quantity} onChange={(q) => draft.setQuantity(p.slug, q)} />}
              </div>
              <p className="text-[15px] font-bold text-ink">{formatCOP(p.price * item.quantity)}</p>
              <button type="button" onClick={() => setRemoving(p)} aria-label={`Quitar ${p.name}`}
                className="grid size-8 shrink-0 place-items-center rounded-full border border-line bg-white text-ink hover:text-coral">
                <Icon name="trash" />
              </button>
            </li>
          );
        })}
      </ul>
      {count === 0 && (
        <p className="rounded-2xl bg-cream px-4 py-6 text-center text-[15px] text-muted">Tu caja está vacía. Elige productos para empezar.</p>
      )}
    </>
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-12">
      <div className="min-w-0">
        <ol className="hidden flex-wrap items-center gap-4 text-[15px] md:flex" aria-label="Pasos">
          {[["Elige productos", count > 0], ["Agrega una carta", hasLetter], ["Revisa y continúa", false]].map(([label, done], i) => (
            <li key={String(label)} className="flex items-center gap-4">
              {i > 0 && <span aria-hidden="true" className="h-px w-9 bg-kraft" />}
              <span className={`grid size-6 place-items-center rounded-full text-xs font-bold ${i === 0 || done ? "bg-coral text-white" : "border border-line bg-white text-muted"}`}>
                {done && i > 0 ? <Icon name="check" size={14} /> : i + 1}
              </span>
              <span className={i === 0 || done ? "font-bold text-ink" : "text-muted"}>{label}</span>
            </li>
          ))}
        </ol>

        {full && <BoxFullNotice className="mt-6" nudge={nudge} action={{ label: "Ver mi caja", onClick: () => setSheetOpen(true), mobileOnly: true }} />}

        <div className="-mx-5 mt-6 flex gap-2 overflow-x-auto [scrollbar-width:none] px-5 pb-1 md:mx-0 md:mt-8 md:flex-wrap md:px-0" role="group" aria-label="Filtrar por categoría">
          <button type="button" className="chip" aria-pressed={filter === null} onClick={() => setFilter(null)}>Todo</button>
          {CATEGORIES.map((c) => (
            <button key={c.id} type="button" className="chip" aria-pressed={filter === c.id} onClick={() => setFilter(c.id)}>{c.title}</button>
          ))}
        </div>

        {CATEGORIES.filter((c) => !filter || filter === c.id).map((c) => {
          const items = products.filter((p) => p.category === c.id && p.slug !== "carta");
          const chosen = d.items.filter((i) => bySlug.get(i.slug)?.category === c.id).length;
          return (
            <section key={c.id} className="mt-10" aria-labelledby={`cat-${c.id}`}>
              <div className="flex items-center gap-5">
                <h2 id={`cat-${c.id}`} className="h-display text-[26px] text-ink md:text-[30px]">{c.title}</h2>
                {c.id === "mensaje"
                  ? hasLetter && <span className="rounded-full bg-blush px-2.5 py-1 text-xs font-bold text-coral">Carta agregada</span>
                  : chosen > 0 && <span className="rounded-full bg-blush px-2.5 py-1 text-xs font-bold text-coral">{chosen} elegido{chosen > 1 ? "s" : ""}</span>}
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-2 xl:grid-cols-3">
                {items.map((p) => <ProductCard key={p.slug} product={p} onFull={onFull} />)}
                {c.id === "mensaje" && (
                  <div className={`col-span-2 rounded-3xl bg-white p-4 md:p-5 ${hasLetter ? "border-2 border-coral" : "border-[1.5px] border-line"}`}>
                    <div className="flex items-start gap-3">
                      <span className="grid size-[52px] shrink-0 place-items-center rounded-2xl bg-cream">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={carta.image} alt="" className="size-10" />
                      </span>
                      <div className="flex-1">
                        <p className="font-serif text-[23px] leading-tight font-semibold text-ink">Agrega una carta</p>
                        <p className="text-[13px] text-muted">La escribimos a mano y va dentro de tu caja</p>
                      </div>
                      <p className="font-bold text-ink">{formatCOP(carta.price)}</p>
                    </div>
                    <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-2xl bg-blush px-4 py-3.5 text-[15px] font-bold text-ink">
                      <input type="checkbox" checked={hasLetter} onChange={() => (hasLetter ? setRemoving(carta) : draft.toggle("carta"))}
                        disabled={!hasLetter && full} aria-describedby={!hasLetter && full ? "letter-full" : undefined} className="size-6 accent-coral" />
                      Sí, quiero agregar una carta
                    </label>
                    {!hasLetter && full && (
                      <p id="letter-full" className="mt-2 flex items-center gap-2 text-[13px] font-semibold text-honey-dark">
                        <Icon name="alert" size={16} /> Tu caja está llena. Quita un producto para sumar la carta.
                      </p>
                    )}
                    {hasLetter && (
                      <div className="mt-4 flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="field"><label htmlFor="to">Para</label>
                            <input id="to" className="input" maxLength={60} value={d.letter.to} onChange={(e) => draft.setLetter({ to: e.target.value })} placeholder="Laura" /></div>
                          <div className="field"><label htmlFor="from">De</label>
                            <input id="from" className="input" maxLength={60} value={d.letter.from} onChange={(e) => draft.setLetter({ from: e.target.value })} placeholder="Camilo" /></div>
                        </div>
                        <div className="rounded-[20px] border-[1.5px] border-line bg-paper px-5 pt-4 pb-4 shadow-[0_8px_24px_rgb(59_42_38/0.06)] focus-within:border-coral">
                          <label htmlFor="message" className="flex items-center gap-2 text-[15px] font-bold text-ink"><Icon name="pen" className="text-coral" /> Escribe tu mensaje...</label>
                          <textarea id="message" rows={3} maxLength={MAX_MESSAGE} value={d.letter.message}
                            onChange={(e) => draft.setLetter({ message: e.target.value })}
                            placeholder="“Espero que esto te saque una sonrisa...”"
                            className="mt-2 w-full resize-none border-b-2 border-line bg-transparent pb-2 font-hand text-2xl leading-[1.3] text-[#8c4b32] outline-none placeholder:text-[#c9bdb3]" />
                          <div className="mt-2 flex justify-between text-[13px]">
                            <span className="text-muted">La escribimos a mano y la incluimos en tu caja</span>
                            <span className="font-semibold text-subtle">{d.letter.message.length} / {MAX_MESSAGE}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>

      {/* Desktop summary */}
      <aside className="hidden lg:block" aria-label="Tu MoodBox">
        <div className="sticky top-[112px] rounded-[28px] border-[1.5px] border-line bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-[28px] font-semibold text-ink">Tu MoodBox</h2>
            {slotsBadge}
          </div>
          <div className="mt-4 flex h-[200px] items-end justify-center overflow-hidden rounded-3xl bg-oat px-4 pt-4">{art}</div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-sand" role="progressbar" aria-valuemin={0} aria-valuemax={MAX_BOX_ITEMS} aria-valuenow={count} aria-label="Espacios usados">
            <div className="h-full rounded-full bg-coral transition-all" style={{ width: `${(count / MAX_BOX_ITEMS) * 100}%` }} />
          </div>
          <p className={`mt-2 text-[13px] font-semibold ${full ? "text-coral" : "text-muted"}`}>
            {full ? "Sin espacios libres: quita algo para agregar otro producto." : `Te ${left === 1 ? "queda 1 espacio libre" : `quedan ${left} espacios libres`}.`}
          </p>
          <div className="mt-4 max-h-[360px] overflow-y-auto">{summary}</div>
          <div className="mt-4 flex flex-col gap-3 rounded-3xl bg-cream p-5">
            <p className="font-serif text-[22px] font-semibold text-ink">Resumen</p>
            <p className="flex justify-between text-sm"><span className="text-muted">Subtotal</span><span className="font-bold">{formatCOP(total)}</span></p>
            <p className="flex justify-between text-sm"><span className="text-muted">Envío</span><span className="font-bold text-teal">Gratis</span></p>
            <p className="flex items-end justify-between border-t border-line pt-3"><span className="font-bold">Total</span><span className="font-serif text-[32px] leading-none font-semibold" aria-live="polite">{formatCOP(total)}</span></p>
          </div>
          <button type="button" className="btn-primary mt-4 w-full" disabled={count === 0} onClick={commit}>
            {d.editingId ? "Guardar cambios" : "Continuar al carrito"}
          </button>
          <p className="mt-3 text-center text-xs text-subtle">Puedes seguir editando tu caja desde el carrito.</p>
        </div>
      </aside>

      {/* Mobile bottom bar + sheet */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-line bg-white px-5 py-4 lg:hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/moodbox/cajas/abierta-tu-moodbox.svg" alt="" className="w-12" />
        <div className="flex-1">
          <p className={`text-[13px] ${full ? "font-bold text-coral" : "text-muted"}`}>{full ? `Caja llena (${count}/${MAX_BOX_ITEMS})` : `${count} de ${MAX_BOX_ITEMS} espacios`}</p>
          <p className="text-xl font-bold text-ink">{formatCOP(total)}</p>
        </div>
        <button type="button" className="btn-primary px-6 py-3.5" onClick={() => setSheetOpen(true)}>Ver mi caja <Icon name="arrow" /></button>
      </div>
      <div className="h-24 lg:hidden" />
      <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)}>
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-[28px] font-semibold text-ink">Tu MoodBox</h2>
          {slotsBadge}
        </div>
        <div className="mt-4 max-h-[50dvh] overflow-y-auto">{summary}</div>
        <p className="mt-5 flex items-end justify-between"><span className="text-[15px] text-muted">Total · envío gratis</span><span className="font-serif text-[32px] leading-none font-semibold">{formatCOP(total)}</span></p>
        <button type="button" className="btn-primary mt-5 w-full" disabled={count === 0} onClick={commit}>
          {d.editingId ? "Guardar cambios" : "Continuar al carrito"}
        </button>
      </Sheet>

      <ConfirmRemove product={removing} articleFor={article} onCancel={() => setRemoving(null)}
        onConfirm={(p) => { draft.toggle(p.slug); setRemoving(null); }} />
    </div>
  );
}

function Sheet({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (open && !el?.open) el?.showModal();
    if (!open && el?.open) el.close();
  }, [open]);
  return (
    <dialog ref={ref} onClose={onClose} onClick={(e) => e.target === ref.current && onClose()} aria-label="Tu MoodBox"
      className="m-0 mt-auto w-full max-w-none rounded-t-[28px] bg-white p-0 backdrop:bg-ink/50 lg:hidden">
      <div className="px-5 pt-3 pb-6">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-line" aria-hidden="true" />
        {children}
      </div>
    </dialog>
  );
}

/** "Modal" component: ¿Quitar la vela de tu caja? */
function ConfirmRemove({ product, articleFor, onCancel, onConfirm }: {
  product: Product | null; articleFor: (p: Product) => string; onCancel: () => void; onConfirm: (p: Product) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (product && !el?.open) el?.showModal();
    if (!product && el?.open) el.close();
  }, [product]);
  return (
    <dialog ref={ref} onClose={onCancel} aria-labelledby="remove-title"
      className="m-auto w-[calc(100%-40px)] max-w-[480px] rounded-[28px] bg-white p-0 shadow-modal backdrop:bg-ink/40">
      {product && (
        <div className="relative flex flex-col items-center gap-4 px-8 pt-8 pb-7 text-center">
          <button type="button" onClick={onCancel} className="absolute top-5 right-5 text-ink" aria-label="Cerrar"><Icon name="close" /></button>
          <span className="grid size-16 place-items-center rounded-full bg-blush text-coral"><Icon name="trash" size={22} /></span>
          <h2 id="remove-title" className="font-serif text-[26px] font-semibold text-ink">¿Quitar {articleFor(product)} {product.name.toLowerCase()} de tu caja?</h2>
          <p className="text-[15px] leading-[1.45] text-muted">Puedes volver a agregarla cuando quieras desde el personalizador.</p>
          <div className="flex gap-3">
            <button type="button" className="btn-outline" onClick={onCancel} autoFocus>Cancelar</button>
            <button type="button" className="btn-primary" onClick={() => onConfirm(product)}>Sí, quitar</button>
          </div>
        </div>
      )}
    </dialog>
  );
}
