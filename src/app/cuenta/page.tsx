import Link from "next/link";
import { OrderCard } from "@/components/Order";
import { requireUser } from "@/lib/auth";
import { getOrders } from "@/lib/data";
import { BOX_THEMES } from "@/lib/theme";

export const metadata = { title: "Mi cuenta" };

export default async function AccountPage() {
  const user = await requireUser("/cuenta");
  const [last] = await getOrders(user.id);
  const data: [string, string | null][] = [
    ["Nombre", user.name], ["Correo", user.email], ["Teléfono", user.phone],
    ["Dirección principal", user.address && [user.address, user.city].filter(Boolean).join(", ")],
  ];
  return (
    <>
      <h1 className="h-display text-[40px] text-ink md:text-[64px] md:leading-[1.2]">Hola, {user.name.split(" ")[0]}</h1>
      <p className="mt-1 font-hand text-[26px] text-coral md:text-[30px]">Qué bueno verte por aquí.</p>

      <h2 className="kicker mt-10 text-[15px] text-muted">Tu último pedido</h2>
      <div className="mt-4">
        {last ? <OrderCard order={last} /> : (
          <div className="rounded-3xl border-[1.5px] border-line bg-white p-6">
            <p className="font-serif text-2xl font-semibold">Aún no tienes pedidos</p>
            <p className="mt-1 text-muted">Cuando compres tu primera MoodBox la verás aquí.</p>
            <Link href="/moodbox" className="btn-primary btn-sm mt-4">Ver MoodBox</Link>
          </div>
        )}
      </div>

      <h2 className="kicker mt-12 text-[15px] text-muted">Datos personales</h2>
      <div className="mt-4 grid gap-5 xl:grid-cols-2">
        <div className="rounded-3xl border-[1.5px] border-line bg-white p-6">
          <dl className="flex flex-col gap-4">
            {data.map(([k, val]) => (
              <div key={k}><dt className="text-[13px] text-muted">{k}</dt><dd className="font-semibold text-ink">{val || "Sin agregar"}</dd></div>
            ))}
          </dl>
          <Link href="/cuenta/datos" className="btn-outline mt-6">Editar mis datos</Link>
        </div>
        <div className="relative overflow-hidden rounded-3xl bg-[#eef0f7] p-7">
          <p className="font-serif text-[30px] font-semibold text-ink">¿Cómo te sientes hoy?</p>
          <p className="mt-3 max-w-[380px] text-[15px] leading-normal text-muted">Cuéntanos y te sugerimos una MoodBox para ti o para alguien especial.</p>
          <Link href="/#como-te-sientes" className="btn-primary mt-6">Encontrar mi MoodBox</Link>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BOX_THEMES["necesito-relajarme"]!.closed} alt="" className="mt-8 w-[200px]" />
        </div>
      </div>
    </>
  );
}
