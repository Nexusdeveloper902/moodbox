"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { Field, FormMessage } from "./Field";
import { Icon } from "./Icon";
import { placeOrder, type FormState } from "@/app/actions";
import { describeLine, type ViewCatalog } from "@/lib/cartView";
import { formatCOP } from "@/lib/format";
import { cart, useHydrated, useStore } from "@/lib/store";

type Defaults = { name: string; email: string; phone: string; address: string; city: string };

function Steps() {
  const steps = [["Carrito", "done"], ["Tus datos", "current"], ["Confirmación", "todo"]] as const;
  return (
    <ol className="flex flex-wrap items-center gap-4 text-[15px]" aria-label="Pasos de la compra">
      {steps.map(([label, s], i) => (
        <li key={label} className="flex items-center gap-4" aria-current={s === "current" ? "step" : undefined}>
          {i > 0 && <span aria-hidden="true" className="hidden h-px w-9 bg-kraft sm:block" />}
          <span className={`grid size-7 place-items-center rounded-full text-xs font-bold ${s === "done" ? "bg-teal text-white" : s === "current" ? "bg-coral text-white" : "border border-line bg-white text-muted"}`}>
            {s === "done" ? <Icon name="check" size={16} /> : i + 1}
          </span>
          <span className={s === "current" ? "font-bold text-ink" : "text-muted"}>{label}</span>
        </li>
      ))}
    </ol>
  );
}

export function CheckoutForm({ catalog, defaults }: { catalog: ViewCatalog; defaults: Defaults }) {
  const hydrated = useHydrated();
  const router = useRouter();
  const { cart: lines } = useStore();
  const [state, action, pending] = useActionState<FormState, FormData>(placeOrder, {});

  useEffect(() => {
    if (!state.orderId) return;
    cart.clear();
    router.replace(`/pedido/${state.orderId}`);
  }, [state.orderId, router]);

  const rows = lines.map((l) => ({ line: l, view: describeLine(l, catalog) })).filter((r) => r.view);
  const total = rows.reduce((s, r) => s + r.view!.unitPrice * r.line.quantity, 0);
  const v = { ...defaults, ...state.values };
  const e = state.errors ?? {};

  if (!hydrated) return <div className="mt-10 h-[400px] animate-pulse rounded-[32px] bg-white/60" aria-label="Cargando" />;
  if (rows.length === 0 && !state.orderId) {
    return (
      <div className="mt-10 rounded-[32px] border border-line bg-white px-6 py-12 text-center">
        <p className="font-serif text-[28px] font-semibold">Tu carrito está vacío</p>
        <p className="mt-2 text-muted">Agrega una MoodBox antes de finalizar tu pedido.</p>
        <Link href="/moodbox" className="btn-primary mt-6">Ver MoodBox</Link>
      </div>
    );
  }

  return (
    <>
      <Steps />
      <h1 className="h-display mt-6 text-[36px] text-ink md:text-[52px]">Finaliza tu pedido</h1>
      <div className="mt-6 grid items-start gap-8 lg:grid-cols-[1fr_440px] lg:gap-[60px]">
        <form id="checkout" action={action} className="flex flex-col gap-6" noValidate>
          <input type="hidden" name="cart" value={JSON.stringify(lines)} />
          <fieldset className="panel p-5 md:p-7">
            <legend className="sr-only">Información de contacto</legend>
            <h2 className="flex items-center gap-3 font-serif text-[26px] font-semibold text-ink" aria-hidden="true">
              <span className="grid size-7 place-items-center rounded-full bg-blush font-sans text-xs font-bold text-coral">1</span> Información de contacto
            </h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Field label="Nombre" name="name" autoComplete="name" defaultValue={v.name} error={e.name} required />
              <Field label="Teléfono" name="phone" type="tel" autoComplete="tel" placeholder="300 123 4567" defaultValue={v.phone} error={e.phone} required />
              <Field label="Correo electrónico" name="email" type="email" autoComplete="email" defaultValue={v.email} error={e.email} required className="md:col-span-2" />
            </div>
          </fieldset>
          <fieldset className="panel p-5 md:p-7">
            <legend className="sr-only">Entrega</legend>
            <h2 className="flex items-center gap-3 font-serif text-[26px] font-semibold text-ink" aria-hidden="true">
              <span className="grid size-7 place-items-center rounded-full bg-blush font-sans text-xs font-bold text-coral">2</span> Entrega
            </h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Field label="Dirección" name="address" autoComplete="street-address" placeholder="Calle 45 # 12-30, apto 502" defaultValue={v.address} error={e.address} required className="md:col-span-2" />
              <Field label="Ciudad" name="city" autoComplete="address-level2" placeholder="Bogotá" defaultValue={v.city} error={e.city} required />
              <Field label="Información adicional (opcional)" name="notes" placeholder="Ej.: dejar en portería" defaultValue={state.values?.notes} />
            </div>
          </fieldset>
          <div className="flex items-center gap-4 rounded-3xl bg-honey-soft p-5 md:px-6">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-ink"><Icon name="lock" size={20} /></span>
            <p><span className="block font-bold text-ink">Pago simulado</span>
              <span className="text-sm text-muted">Esto es un prototipo: no te pediremos datos de tarjeta. Al confirmar, simulamos la compra.</span></p>
          </div>
        </form>

        <aside className="panel p-5 md:p-6" aria-label="Tu pedido">
          <h2 className="font-serif text-[28px] font-semibold text-ink">Tu pedido</h2>
          <ul className="mt-5 flex flex-col gap-4">
            {rows.map(({ line, view: r }) => (
              <li key={line.id} className="rounded-3xl bg-cream p-3">
                <div className="flex items-start gap-3.5">
                  <span className="grid size-[72px] shrink-0 place-items-center rounded-2xl" style={{ background: r!.tile }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={r!.image} alt="" className="w-[80%]" />
                  </span>
                  <div className="min-w-0 flex-1 pt-2">
                    <p className="font-serif text-xl font-semibold text-ink">{r!.name}</p>
                    <p className="text-[13px] text-muted">
                      {r!.kicker} · Cantidad: {line.quantity}
                      {line.kind === "custom" && line.letter?.to ? ` · Carta para ${line.letter.to}` : ""}
                    </p>
                  </div>
                  <p className="pt-2 font-bold text-ink">{formatCOP(r!.unitPrice * line.quantity)}</p>
                </div>
                {r!.icons.length > 0 && (
                  <div className="mt-3 flex gap-2">
                    {r!.icons.map((src, i) => (
                      <span key={i} className="grid size-10 place-items-center rounded-xl bg-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="" className="size-7" />
                      </span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-3 rounded-3xl bg-cream p-6">
            <p className="font-serif text-[26px] font-semibold text-ink">Total a pagar</p>
            <p className="flex justify-between text-[15px]"><span className="text-muted">Subtotal</span><span className="font-bold">{formatCOP(total)}</span></p>
            <p className="flex justify-between text-[15px]"><span className="text-muted">Envío</span><span className="font-bold text-teal">Gratis</span></p>
            <p className="flex items-end justify-between border-t border-line pt-4"><span className="font-bold">Total</span><span className="font-serif text-[36px] leading-none font-semibold">{formatCOP(total)}</span></p>
          </div>
          {state.message && <div className="mt-4"><FormMessage>{state.message}</FormMessage></div>}
          <button type="submit" form="checkout" className="btn-primary mt-5 w-full" disabled={pending || !!state.orderId}>
            {pending || state.orderId ? "Confirmando tu pedido…" : "Confirmar pedido"}
          </button>
          <p className="mt-3 text-center text-[13px] text-subtle">Al confirmar aceptas que es una compra de prueba.</p>
        </aside>
      </div>
    </>
  );
}
