import Link from "next/link";
import { OrderCard } from "@/components/Order";
import { Icon } from "@/components/Icon";
import { requireUser } from "@/lib/auth";
import { getOrders } from "@/lib/data";

export const metadata = { title: "Mis pedidos" };

const FILTERS = [["todos", "Todos"], ["en-proceso", "En proceso"], ["entregados", "Entregados"]] as const;

export default async function OrdersPage({ searchParams }: PageProps<"/cuenta/pedidos">) {
  const user = await requireUser("/cuenta/pedidos");
  const estado = (await searchParams).estado ?? "todos";
  const all = await getOrders(user.id);
  const orders = all.filter((o) => estado === "entregados" ? o.status === "entregado" : estado === "en-proceso" ? o.status !== "entregado" : true);

  return (
    <>
      <h1 className="h-display text-[40px] text-ink md:text-[64px] md:leading-[1.2]">Mis pedidos</h1>
      <p className="mt-1 text-lg text-muted">{all.length} {all.length === 1 ? "pedido" : "pedidos"} · Aquí puedes ver en qué va cada caja.</p>
      <nav aria-label="Filtrar pedidos" className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map(([id, label]) => (
          <Link key={id} href={id === "todos" ? "/cuenta/pedidos" : `/cuenta/pedidos?estado=${id}`} className="chip" aria-current={estado === id ? "page" : undefined}>{label}</Link>
        ))}
      </nav>
      <div className="mt-6 flex flex-col gap-4">
        {orders.map((o) => <OrderCard key={o.id} order={o} />)}
        {orders.length === 0 && (
          <div className="rounded-3xl border-[1.5px] border-line bg-white p-8 text-center">
            <p className="font-serif text-2xl font-semibold">{all.length ? "No hay pedidos en esta categoría" : "Aún no tienes pedidos"}</p>
            <p className="mt-2 text-muted">{all.length ? "Prueba con otro filtro." : "Cuando compres tu primera MoodBox la verás aquí."}</p>
            {!all.length && <Link href="/moodbox" className="btn-primary mt-5">Ver MoodBox</Link>}
          </div>
        )}
      </div>
      <p className="mt-6 flex items-center gap-3 rounded-2xl bg-sand px-6 py-5 text-[15px] text-ink">
        <Icon name="heart" className="text-coral" /> ¿Algo no llegó como esperabas? Escríbenos por WhatsApp y lo resolvemos.
      </p>
    </>
  );
}
