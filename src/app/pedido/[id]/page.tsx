import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { OrderReceipt } from "@/components/Order";
import { requireUser } from "@/lib/auth";
import { getOrder } from "@/lib/data";
import { BOX_THEMES } from "@/lib/theme";

export const metadata = { title: "¡Pedido confirmado!" };

const CONFETTI = [
  "top-[40px] left-[22%] h-[22px] w-[14px] bg-honey rotate-[8deg]", "top-[55px] right-[23%] h-[12px] w-[18px] bg-coral rotate-[-14deg]",
  "top-[190px] left-[25%] h-[20px] w-[10px] bg-teal rotate-[35deg]", "top-[210px] right-[22%] h-[10px] w-[16px] bg-honey rotate-[20deg]",
  "top-[300px] left-[20%] h-[14px] w-[14px] bg-coral rotate-[10deg]", "top-[300px] right-[25%] h-[10px] w-[20px] bg-[#b8a6e0] rotate-[-30deg]",
];

export default async function OrderConfirmed({ params }: PageProps<"/pedido/[id]">) {
  const { id } = await params;
  const user = await requireUser(`/pedido/${id}`);
  const order = await getOrder(Number(id), user.id);
  if (!order) notFound();

  return (
    <div className="wrap relative pt-8 pb-20 text-center md:pt-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 hidden md:block">
        {CONFETTI.map((c) => <span key={c} className={`absolute rounded-[3px] ${c}`} />)}
        <Icon name="sparkle" size={30} className="absolute top-[118px] left-[33%] text-honey" />
        <Icon name="sparkle" size={26} className="absolute top-[140px] right-[33%] text-honey" />
      </div>
      <div className="relative mx-auto grid size-[260px] place-items-center rounded-full bg-peach md:size-[400px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={BOX_THEMES["quiero-sorprender"]!.closed} alt="" className="w-[70%] md:w-[75%]" />
        <span className="absolute bottom-6 inline-flex items-center gap-1.5 rounded-full bg-teal-soft px-3 py-1.5 text-[13px] font-bold text-teal-dark md:bottom-3">
          <Icon name="check" size={14} /> Pedido confirmado
        </span>
      </div>
      <h1 className="h-display mt-2 text-[40px] text-ink md:text-[60px]">¡Tu MoodBox está en camino!</h1>
      <p className="mt-3 font-hand text-[26px] text-coral md:text-[32px]">Un pequeño detalle puede cambiar tu día.</p>
      <p className="mx-auto mt-3 max-w-[700px] text-lg leading-normal text-muted">
        Gracias por regalar (o regalarte) un momento bonito. Te enviamos la confirmación a {order.email}.
      </p>
      <div className="mx-auto mt-8 max-w-[760px] text-left"><OrderReceipt order={order} /></div>
      <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/" className="btn-primary">Volver al inicio</Link>
        <Link href="/cuenta/pedidos" className="btn-outline">Ver mis pedidos</Link>
      </div>
    </div>
  );
}
