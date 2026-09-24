import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { OrderReceipt, StatusBadge } from "@/components/Order";
import { requireUser } from "@/lib/auth";
import { getOrder } from "@/lib/data";
import { orderRef } from "@/lib/format";

export default async function OrderDetail({ params }: PageProps<"/cuenta/pedidos/[id]">) {
  const { id } = await params;
  const user = await requireUser(`/cuenta/pedidos/${id}`);
  const order = await getOrder(Number(id), user.id);
  if (!order) notFound();
  return (
    <>
      <Link href="/cuenta/pedidos" className="inline-flex items-center gap-2 text-[15px] font-semibold text-muted hover:text-ink"><Icon name="back" /> Mis pedidos</Link>
      <div className="mt-4 mb-6 flex flex-wrap items-center gap-4">
        <h1 className="h-display text-[36px] text-ink md:text-[52px]">Pedido {orderRef(order.id)}</h1>
        <StatusBadge status={order.status} />
      </div>
      <OrderReceipt order={order} />
      <div className="mt-5 rounded-3xl border-[1.5px] border-line bg-white p-6 text-[15px]">
        <p className="font-bold text-ink">Datos de entrega</p>
        <p className="mt-2 text-muted">{order.name} · {order.phone} · {order.email}</p>
        <p className="text-muted">{order.address}, {order.city}{order.notes ? ` · ${order.notes}` : ""}</p>
      </div>
    </>
  );
}
