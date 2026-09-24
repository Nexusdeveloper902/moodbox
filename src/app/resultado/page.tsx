import Link from "next/link";
import { redirect } from "next/navigation";
import { Art } from "@/components/Art";
import { Icon } from "@/components/Icon";
import { MoodBoxMini } from "@/components/MoodBoxCard";
import { getMoodboxes } from "@/lib/data";
import { formatCOP } from "@/lib/format";
import { classifyMood } from "@/lib/classify";
import { BOX_THEMES, themeVars } from "@/lib/theme";

export const metadata = { title: "Tu recomendación" };

const HEADLINES: Record<string, string> = {
  "dia-dificil": "Parece que hoy fue un día pesado.",
  "necesito-relajarme": "Parece que necesitas un momento para ti.",
  "quiero-sorprender": "Parece que quieres alegrarle el día a alguien.",
};

export default async function ResultPage({ searchParams }: PageProps<"/resultado">) {
  const q = (await searchParams).q;
  const text = (Array.isArray(q) ? q[0] : q)?.trim().slice(0, 500);
  if (!text) redirect("/#como-te-sientes");

  const match = await classifyMood(text);
  const boxes = await getMoodboxes();
  const box = boxes.find((b) => b.slug === match.slug)!;
  const others = boxes.filter((b) => b.slug !== box.slug);

  return (
    <div style={themeVars(box.slug)}>
      <section className="wrap grid gap-8 pt-6 md:pt-10 lg:grid-cols-[1fr_720px] lg:gap-10">
        <div>
          <Link href={`/?q=${encodeURIComponent(text)}#como-te-sientes`} className="inline-flex items-center gap-2 text-[15px] font-semibold text-muted hover:text-ink">
            <Icon name="back" /> Volver a escribir
          </Link>
          <p className="kicker box-accent mt-6 text-[11px] md:mt-12 md:text-[13px]">Leímos lo que escribiste</p>
          <h1 className="h-display mt-3 text-[34px] md:mt-4 md:text-[56px]">{HEADLINES[box.slug]}</h1>
          <div className="mt-6 hidden rounded-3xl border-[1.5px] border-line bg-white px-6 py-6 md:mt-9 md:block">
            <p className="text-[13px] font-semibold text-subtle">Tú escribiste</p>
            <p className="mt-2 text-lg leading-normal text-ink">“{text}”</p>
          </div>
          {match.words.length > 0 ? (
            <div className="mt-6 md:mt-12">
              <p className="text-sm font-semibold text-muted">Palabras que nos guiaron</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {match.words.map((w) => <li key={w} className="box-accent rounded-full bg-box-chip px-3.5 py-1.5 text-[15px] font-semibold">{w}</li>)}
              </ul>
            </div>
          ) : !match.matched && (
            <p className="mt-6 text-[15px] text-muted md:mt-10">No encontramos palabras claras, así que te sugerimos nuestra caja más querida. También puedes elegir otra abajo.</p>
          )}
          <p className="mt-8 hidden max-w-[460px] text-sm leading-normal text-subtle md:block">Esto no es un diagnóstico. Solo usamos tus palabras para sugerirte una experiencia de regalo.</p>
        </div>

        <article className="card p-4 shadow-float md:rounded-[32px]">
          <div className="relative flex aspect-[688/330] items-end justify-center rounded-3xl bg-box-scene px-6 pt-6 pb-3">
            <span className="absolute top-6 left-6 inline-flex items-center gap-1.5 rounded-full bg-blush px-3 py-1.5 text-[13px] font-bold text-coral"><Icon name="sparkle" /> Recomendada</span>
            <Art src={BOX_THEMES[box.slug]!.open} alt={`Caja abierta ${box.name}`} className="h-[96%]" />
          </div>
          <div className="px-2 pt-6 pb-4 md:px-8">
            <p className="text-[15px] font-semibold text-ink">Te recomendamos:</p>
            <h2 className="box-ink mt-2 font-serif text-[32px] leading-[1.1] font-semibold md:text-[44px]">{box.name}</h2>
            <p className="box-accent mt-3 font-hand text-2xl md:text-[26px]">{box.quote}</p>
            <p className="mt-3 text-base leading-normal text-muted">{box.description}</p>
            <ul className="mt-8 grid gap-4 sm:grid-cols-3">
              {box.items.map((i) => (
                <li key={i.slug} className="flex items-center gap-3">
                  <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-box-chip">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={i.image} alt="" className="size-10" />
                  </span>
                  <span>
                    <span className="block font-bold text-ink">{i.label}</span>
                    <span className="block text-[13px] text-muted">{i.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="box-ink font-serif text-[40px] leading-none font-semibold">{formatCOP(box.price)}</p>
                <p className="mt-1 text-[13px] text-muted">COP · envío incluido</p>
              </div>
              <div className="flex gap-3">
                <Link href={`/moodbox/${box.slug}`} className="btn bg-box-accent flex-1 text-white shadow-[0_8px_18px_rgb(46_34_48/0.15)] sm:flex-none">Ver MoodBox</Link>
                <Link href={`/personaliza?desde=${box.slug}`} className="btn-outline flex-1 sm:flex-none">Personalizar</Link>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="wrap mt-16 mb-20 md:mt-20" aria-labelledby="otras">
        <h2 id="otras" className="h-display text-[26px] md:text-4xl">¿No es lo que buscabas?</h2>
        <p className="mt-2 text-base text-muted md:text-[17px]">También podrían gustarte estas cajas, o puedes armar la tuya.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {others.map((b) => <MoodBoxMini key={b.slug} box={b} />)}
          <div className="relative rounded-3xl bg-oat p-6">
            <p className="font-serif text-2xl font-semibold text-cocoa">¿Prefieres elegir tú?</p>
            <p className="mt-2 text-sm text-muted">Arma tu propia MoodBox producto por producto.</p>
            <Link href="/personaliza" className="mt-3 inline-flex items-center gap-2 text-[15px] font-bold text-coral after:absolute after:inset-0">Personalizar mi caja <Icon name="arrow" /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
