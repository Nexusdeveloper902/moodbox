import Link from "next/link";
import { Icon } from "./Icon";
import type { Order, OrderItem, OrderStatus } from "@/lib/data";
import { formatCOP, formatDate, orderRef } from "@/lib/format";
import { BOX_THEMES, CUSTOM_BOX_ART, boxLabel } from "@/lib/theme";

const STATUS: Record<OrderStatus, { label: string; cls: string; icon: "check" | "truck" | "gift" }> = {
  confirmado: { label: "Pedido confirmado", cls: "bg-teal-soft text-teal-dark", icon: "check" },
  en_camino: { label: "En camino", cls: "bg-honey-soft text-honey-dark", icon: "truck" },
  entregado: { label: "Entregado", cls: "bg-sand text-ink", icon: "gift" },
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const s = STATUS[status];
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-bold ${s.cls}`}><Icon name={s.icon} size={14} />{s.label}</span>;
}

function thumb(item: OrderItem) {
  if (item.kind === "moodbox" && item.moodbox_slug) return { src: BOX_THEMES[item.moodbox_slug]!.closed, bg: BOX_THEMES[item.moodbox_slug]!.scene };
  if (item.kind === "custom") return { src: CUSTOM_BOX_ART, bg: "#f3ece2" };
  return { src: `/moodbox/products/${item.product_slug}.svg`, bg: "#f7f4ef" };
}

export function ItemThumb({ item, size = 64 }: { item: OrderItem; size?: number }) {
  const t = thumb(item);
  return (
    <span className="grid shrink-0 place-items-center rounded-2xl" style={{ background: t.bg, width: size, height: size }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={t.src} alt="" className="w-[80%]" />
    </span>
  );
}

const itemsText = (o: Order) =>
  o.items.map((i) => (i.contents.length ? `${i.name} (${i.contents.map((c) => c.name).join(", ")})` : i.name)).join(" · ");

/** Row in "Mis pedidos" and "Tu último pedido". */
export function OrderCard({ order }: { order: Order }) {
  return (
    <article className="relative flex flex-col gap-4 rounded-3xl border-[1.5px] border-line bg-white p-5 sm:flex-row sm:items-center sm:gap-6">
      <div className="flex gap-2">{order.items.slice(0, 2).map((i) => <ItemThumb key={i.id} item={i} size={76} />)}</div>
      <div className="min-w-0 flex-1">
        <h3 className="font-serif text-2xl font-semibold text-ink">Pedido {orderRef(order.id)}</h3>
        <p className="text-sm text-subtle">{formatDate(order.created_at)}</p>
        <p className="mt-1 line-clamp-2 text-[15px] text-muted">{itemsText(order)}</p>
      </div>
      <div className="flex flex-row items-center justify-between gap-3 sm:flex-col sm:items-end">
        <StatusBadge status={order.status} />
        <p className="text-lg font-bold text-ink">{formatCOP(order.total)}</p>
        <Link href={`/cuenta/pedidos/${order.id}`} className="inline-flex items-center gap-1 text-[15px] font-bold text-coral after:absolute after:inset-0 after:rounded-3xl">
          Ver detalle<span className="sr-only"> del pedido {orderRef(order.id)}</span> <Icon name="chevron" />
        </Link>
      </div>
    </article>
  );
}

const shortDate = (d: Date) => d.toLocaleDateString("es-CO", { day: "numeric", timeZone: "America/Bogota" });
const monthOf = (d: Date) => d.toLocaleDateString("es-CO", { month: "long", timeZone: "America/Bogota" });

/** Receipt card on the confirmation page and order detail. */
export function OrderReceipt({ order }: { order: Order }) {
  const created = new Date(order.created_at);
  const from = new Date(created.getTime() + 2 * 864e5);
  const to = new Date(created.getTime() + 4 * 864e5);
  const eta = monthOf(from) === monthOf(to)
    ? `entre el ${shortDate(from)} y el ${shortDate(to)} de ${monthOf(to)}`
    : `entre el ${shortDate(from)} de ${monthOf(from)} y el ${shortDate(to)} de ${monthOf(to)}`;

  return (
    <div className="rounded-[28px] border border-line bg-white p-6 shadow-card md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-5">
        <div>
          <p className="kicker text-[13px] text-subtle">Número de pedido</p>
          <p className="mt-1 font-serif text-[32px] font-semibold text-ink">{orderRef(order.id)}</p>
        </div>
        <div className="text-right">
          <p className="kicker text-[13px] text-subtle">Fecha</p>
          <p className="mt-2 font-semibold text-ink">{formatDate(order.created_at)}</p>
        </div>
      </div>
      <ul className="flex flex-col gap-4 border-b border-line py-5">
        {order.items.map((i) => (
          <li key={i.id} className="flex items-center gap-4">
            <ItemThumb item={i} />
            <div className="min-w-0 flex-1">
              <p className="font-serif text-[22px] font-semibold text-ink">
                {i.name}{i.quantity > 1 && <span className="font-sans text-base text-muted"> ×{i.quantity}</span>}
              </p>
              <p className="text-sm text-muted">
                {i.kind === "moodbox" && i.moodbox_number ? `${boxLabel(i.moodbox_number)} · ` : ""}
                {i.contents.map((c) => `${c.name}${c.quantity > 1 ? ` ×${c.quantity}` : ""}`).join(" · ")}
              </p>
              {i.custom_message && (
                <p className="mt-1 font-hand text-lg text-[#8c4b32]">
                  {i.letter_to && <>Para {i.letter_to}: </>}“{i.custom_message}”{i.letter_from && <> — {i.letter_from}</>}
                </p>
              )}
            </div>
            <p className="font-bold text-ink">{formatCOP(i.unit_price * i.quantity)}</p>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between py-5">
        <p className="text-[15px] text-muted">Total pagado (simulado) · Envío gratis</p>
        <p className="font-serif text-[34px] leading-none font-semibold text-ink">{formatCOP(order.total)}</p>
      </div>
      <p className="flex items-center gap-3 rounded-2xl bg-teal-soft px-5 py-4 text-[15px] font-semibold text-teal-dark">
        <Icon name="truck" size={20} className="shrink-0" />
        {order.status === "entregado" ? `Entregado en ${order.address}, ${order.city}` : `Llega ${eta} a ${order.address}, ${order.city}`}
      </p>
    </div>
  );
}
