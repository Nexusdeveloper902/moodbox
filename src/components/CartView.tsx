"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "./Icon";
import { QtyStepper } from "./QtyStepper";
import { describeLine, type ViewCatalog } from "@/lib/cartView";
import { formatCOP } from "@/lib/format";
import { cart, cartCount, draft, useHydrated, useStore } from "@/lib/store";

export function CartView({ catalog }: { catalog: ViewCatalog }) {
  const hydrated = useHydrated();
  const router = useRouter();
  const { cart: lines } = useStore();
  const rows = lines.map((l) => ({ line: l, view: describeLine(l, catalog) })).filter((r) => r.view);
  const total = rows.reduce((s, r) => s + r.view!.unitPrice * r.line.quantity, 0);
  const count = cartCount(lines);
  const blocked = rows.some((r) => r.view!.problem);

  if (!hydrated) return <div className="mt-10 h-[300px] animate-pulse rounded-[32px] bg-white/60" aria-label="Cargando tu carrito" />;

  if (rows.length === 0) {
    return (
      <div className="mt-8 flex flex-col items-center rounded-[32px] border border-line bg-white px-6 py-14 text-center">
        <div className="grid size-[180px] place-items-center rounded-[32px] bg-oat">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/moodbox/cajas/carrito-vacio.svg" alt="" className="w-[160px]" />
        </div>
        <h2 className="mt-6 font-serif text-[34px] font-semibold text-ink">Tu carrito está vacío</h2>
        <p className="mt-3 max-w-[560px] text-[17px] text-muted">Cuéntanos cómo te sientes y te ayudamos a encontrar la caja ideal, o arma la tuya desde cero.</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/#como-te-sientes" className="btn-primary">Encontrar mi MoodBox</Link>
          <Link href="/moodbox" className="btn-outline">Ver MoodBox</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <p className="mt-2 text-lg text-muted">{count} {count === 1 ? "producto" : "productos"}</p>
      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_440px] lg:gap-20">
        <div>
          <ul className="flex flex-col gap-4">
            {rows.map(({ line, view: v }) => (
              <li key={line.id} className="flex flex-wrap items-center gap-4 rounded-[22px] border-[1.5px] border-line bg-white p-4 md:flex-nowrap md:gap-5 md:py-4 md:pr-5">
                <div className="grid size-24 shrink-0 place-items-center rounded-2xl md:size-[120px]" style={{ background: v!.tile }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={v!.image} alt="" className="w-[80%]" />
                </div>
                <div className="min-w-0 flex-1 basis-[180px]">
                  <p className="kicker text-coral">{v!.kicker}</p>
                  <h2 className="mt-1.5 font-serif text-[22px] font-semibold text-ink md:text-2xl">
                    {v!.href ? <Link href={v!.href} className="hover:underline">{v!.name}</Link> : v!.name}
                  </h2>
                  <p className="mt-1.5 text-sm text-muted">{v!.contents}</p>
                  {line.kind === "custom" && line.letter?.message && <p className="mt-1 truncate font-hand text-lg text-[#8c4b32]">“{line.letter.message}”</p>}
                  {line.kind === "custom" && (
                    <button type="button" className="mt-2 inline-flex items-center gap-1.5 text-[15px] font-bold text-coral"
                      onClick={() => { draft.load(line.items, line.letter, line.id); router.push("/personaliza"); }}>
                      <Icon name="pen" size={16} /> Editar contenido
                    </button>
                  )}
                  {v!.problem && <p className="field-error mt-2 font-bold">{v!.problem}</p>}
                </div>
                <QtyStepper value={line.quantity} onChange={(q) => cart.setQuantity(line.id, q)} label={`Cantidad de ${v!.name}`} />
                <div className="ml-auto flex min-w-[110px] flex-col items-end gap-2.5">
                  <p className="text-lg font-bold text-ink">{formatCOP(v!.unitPrice * line.quantity)}</p>
                  <button type="button" onClick={() => cart.remove(line.id)} className="inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-danger">
                    <Icon name="trash" /> Eliminar<span className="sr-only"> {v!.name}</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <Link href="/moodbox" className="mt-8 inline-flex items-center gap-2 font-bold text-ink"><Icon name="back" /> Seguir comprando</Link>
        </div>

        <div>
          <div className="panel flex flex-col gap-4 p-6">
            <h2 className="font-serif text-[26px] font-semibold text-ink">Resumen del pedido</h2>
            <p className="flex justify-between text-[15px]"><span className="text-muted">Subtotal</span><span className="font-bold">{formatCOP(total)}</span></p>
            <p className="flex justify-between text-[15px]"><span className="text-muted">Envío</span><span className="font-bold text-teal">Gratis</span></p>
            <p className="flex items-end justify-between border-t border-line pt-4"><span className="font-bold">Total</span><span className="font-serif text-[34px] leading-none font-semibold">{formatCOP(total)}</span></p>
          </div>
          {blocked
            ? <p className="btn mt-4 w-full bg-disabled text-subtle" aria-disabled="true">Continuar con la compra</p>
            : <Link href="/checkout" className="btn-primary mt-4 w-full">Continuar con la compra</Link>}
          <p className="mt-5 flex items-center gap-3 text-sm text-muted"><Icon name="truck" size={18} /> Envío gratis a toda Colombia</p>
          <p className="mt-3 flex items-center gap-3 text-sm text-muted"><Icon name="lock" /> Compra simulada: no se hará ningún cobro real</p>
        </div>
      </div>
    </>
  );
}
