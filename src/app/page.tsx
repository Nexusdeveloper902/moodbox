import Link from "next/link";
import { Art } from "@/components/Art";
import { Icon, type IconName } from "@/components/Icon";
import { MoodBoxCard, MoodBoxRow } from "@/components/MoodBoxCard";
import { MoodForm } from "@/components/MoodForm";
import { getMoodboxes } from "@/lib/data";
import { BOX_THEMES, CUSTOM_BOX_ART } from "@/lib/theme";

const STEPS: { icon: IconName; bg: string; color: string; title: string; text: string }[] = [
  { icon: "heart", bg: "bg-blush", color: "text-coral", title: "1. Cuéntanos cómo te sientes", text: "Escribe con tus palabras, sin formularios raros." },
  { icon: "sparkle", bg: "bg-honey-soft", color: "text-honey", title: "2. Te recomendamos una caja", text: "Leemos tu mensaje y elegimos la MoodBox ideal." },
  { icon: "gift", bg: "bg-teal-soft", color: "text-teal", title: "3. Personalízala y listo", text: "Agrega detalles, una carta y la llevamos a tu puerta." },
];

function MiniProduct({ slug, selected, className }: { slug: string; selected?: boolean; className: string }) {
  return (
    <div className={`absolute grid size-[88px] place-items-center rounded-[22px] bg-white shadow-[0_8px_20px_rgb(59_42_38/0.08)] md:size-[112px] ${selected ? "border-2 border-coral" : ""} ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/moodbox/products/${slug}.svg`} alt="" className="size-[75%]" />
    </div>
  );
}

export default async function Home({ searchParams }: PageProps<"/">) {
  const q = (await searchParams).q;
  const boxes = await getMoodboxes();
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute top-[52px] -left-[210px] hidden size-[420px] rounded-full bg-peach/80 md:block" />
          <div className="absolute top-[235px] -right-[180px] hidden size-[400px] rounded-full bg-lilac-soft md:block" />
          <div className="absolute -top-[30px] -right-[110px] size-[260px] rounded-full bg-peach/80 md:hidden" />
          {/* eslint-disable @next/next/no-img-element */}
          <img src={BOX_THEMES["dia-dificil"]!.closed} alt="" className="absolute top-[245px] left-[3%] hidden w-[230px] -rotate-6 lg:block" />
          <img src={BOX_THEMES["necesito-relajarme"]!.closed} alt="" className="absolute top-[100px] right-[3%] hidden w-[210px] rotate-6 lg:block" />
          <img src={BOX_THEMES["quiero-sorprender"]!.closed} alt="" className="absolute top-[330px] right-[2%] hidden w-[230px] -rotate-3 lg:block" />
          <img src={BOX_THEMES["quiero-sorprender"]!.closed} alt="" className="absolute top-2 -right-4 w-[150px] rotate-[-8deg] md:hidden" />
          {/* eslint-enable @next/next/no-img-element */}
          <Icon name="sparkle" size={30} className="absolute top-[70px] left-[15%] hidden text-honey md:block" />
          <Icon name="sparkle" size={24} className="absolute top-[62px] right-[21%] hidden text-honey md:block" />
          <Icon name="sparkle" size={20} className="absolute top-[455px] left-[12%] hidden text-honey md:block" />
        </div>

        <div id="como-te-sientes" className="wrap relative scroll-mt-24 pt-6 pb-16 md:pt-11 md:pb-[70px]">
          <div className="md:text-center">
            <p className="kicker inline-flex rounded-full bg-white px-3 py-2.5 text-[11px] text-coral md:px-[14px] md:text-[13px]">Regalos según cómo te sientes</p>
            <h1 className="h-display mt-4 max-w-[260px] text-[44px] leading-[1.05] md:mx-auto md:mt-5 md:max-w-none md:text-[64px] lg:text-[80px] lg:leading-[1.2]">¿Cómo te sientes hoy?</h1>
            <p className="mt-3 max-w-[330px] text-[17px] leading-[1.35] text-muted md:mx-auto md:mt-2 md:max-w-none md:text-[21px]">
              Cuéntanos cómo te sientes y encontraremos una MoodBox para ti.
            </p>
          </div>
          <div className="mx-auto mt-8 max-w-[840px] md:mt-10">
            <MoodForm defaultValue={typeof q === "string" ? q.slice(0, 500) : ""} />
            <p className="mt-10 hidden text-center text-sm text-subtle md:block">No es un diagnóstico: solo leemos tus palabras para sugerirte un detalle bonito.</p>
          </div>
        </div>
      </section>

      {/* Boxes */}
      <section className="wrap" aria-labelledby="elige">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="elige" className="h-display text-[28px] md:text-[48px] md:leading-[1.2]">Elige según tu momento</h2>
            <p className="mt-1 hidden text-lg text-muted md:block">Tres cajas pensadas para tres momentos. Todas se pueden personalizar.</p>
          </div>
          <Link href="/moodbox" className="hidden items-center gap-2 font-bold text-coral md:flex">Ver todas las MoodBox <Icon name="arrow" size={18} /></Link>
        </div>
        <div className="mt-8 hidden items-start gap-10 md:grid md:grid-cols-2 lg:grid-cols-3">
          {boxes.map((b) => <MoodBoxCard key={b.slug} box={b} />)}
        </div>
        <div className="mt-5 flex flex-col gap-3 md:hidden">
          {boxes.map((b) => <MoodBoxRow key={b.slug} box={b} />)}
        </div>
      </section>

      {/* How it works */}
      <section className="wrap mt-[72px] hidden rounded-[32px] border border-line bg-white px-8 py-10 md:block" aria-labelledby="asi-funciona">
        <h2 id="asi-funciona" className="h-display text-4xl">Así funciona</h2>
        <ol className="mt-8 grid gap-8 lg:grid-cols-3">
          {STEPS.map((s) => (
            <li key={s.title} className="flex gap-4">
              <span className={`grid size-14 shrink-0 place-items-center rounded-[18px] ${s.bg} ${s.color}`}><Icon name={s.icon} size={26} /></span>
              <div>
                <p className="text-[19px] font-bold text-cocoa">{s.title}</p>
                <p className="mt-1 max-w-[260px] text-[15px] leading-[1.45] text-muted">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Personaliza banner */}
      <section className="wrap mt-12 mb-16 md:mt-14 md:mb-14" aria-labelledby="personaliza">
        <div className="grid items-center gap-6 overflow-hidden rounded-[32px] bg-oat p-6 md:p-10 lg:grid-cols-[1fr_1.1fr] lg:gap-10 lg:py-12">
          <div className="order-2 lg:order-1">
            <p className="kicker hidden rounded-full bg-white px-3.5 py-2.5 text-[13px] text-coral md:inline-flex">MoodBox a tu manera</p>
            <h2 id="personaliza" className="h-display text-[28px] md:mt-6 md:text-[44px] md:leading-[1.2]">Personaliza tu MoodBox</h2>
            <p className="mt-2 font-hand text-[26px] text-coral md:text-[30px]">“Tú eliges qué lleva.”</p>
            <p className="mt-4 hidden max-w-[400px] text-[17px] leading-normal text-muted md:block">
              Elige entre 13 productos, agrega una carta escrita a mano y arma una caja que diga exactamente lo que sientes.
            </p>
            <Link href="/personaliza" className="btn-primary mt-6 w-full md:mt-8 md:w-auto">Personalizar mi caja</Link>
          </div>
          <div className="relative order-1 mx-auto h-[190px] w-full max-w-[520px] md:h-[380px] lg:order-2">
            <Art src={CUSTOM_BOX_ART} alt="Caja abierta Tu MoodBox con productos" className="absolute bottom-0 left-0 w-[62%] md:left-[18%] md:w-[70%]" />
            <MiniProduct slug="gomitas" selected className="top-4 left-0 hidden md:grid" />
            <MiniProduct slug="pulsera" selected className="bottom-4 left-0 hidden md:grid" />
            <MiniProduct slug="vela" className="top-0 right-0 hidden md:grid" />
            <MiniProduct slug="te" className="right-0 bottom-20 hidden md:grid" />
          </div>
        </div>
      </section>
    </>
  );
}
