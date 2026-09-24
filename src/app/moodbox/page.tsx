import Link from "next/link";
import { Art } from "@/components/Art";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Icon } from "@/components/Icon";
import { MoodBoxCard } from "@/components/MoodBoxCard";
import { getMoodboxes } from "@/lib/data";
import { CUSTOM_BOX_ART, themeVars } from "@/lib/theme";

export const metadata = { title: "Nuestras MoodBox" };

export default async function MoodBoxCatalog() {
  const boxes = await getMoodboxes();
  return (
    <div className="wrap pt-8 pb-16 md:pt-10 md:pb-24">
      <Breadcrumbs items={[["Inicio", "/"], ["MoodBox"]]} />
      <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="h-display text-[40px] md:text-[64px] md:leading-[1.2]">Nuestras MoodBox</h1>
          <p className="mt-2 max-w-[640px] text-lg leading-normal text-muted md:text-xl">
            Tres cajas listas para regalar o regalarte. Todas llegan con envío incluido y se pueden personalizar.
          </p>
        </div>
        <Link href="/#como-te-sientes" className="flex items-center gap-4 rounded-3xl border-[1.5px] border-line bg-white p-5 pr-8 lg:mb-3">
          <span className="grid size-[52px] place-items-center rounded-2xl bg-blush text-coral"><Icon name="heart" size={22} /></span>
          <span>
            <span className="block font-bold text-ink">¿No sabes cuál elegir?</span>
            <span className="flex items-center gap-2 font-bold text-coral">Cuéntanos cómo te sientes <Icon name="arrow" /></span>
          </span>
        </Link>
      </div>

      <div className="mt-10 grid items-start gap-8 md:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-10">
        {boxes.map((b) => <MoodBoxCard key={b.slug} box={b} />)}
      </div>

      <section className="mt-16 rounded-[32px] border border-line bg-white p-6 md:mt-20 md:p-12" aria-labelledby="que-trae">
        <h2 id="que-trae" className="h-display text-[28px] md:text-[34px]">Qué trae cada caja</h2>
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {boxes.map((b) => (
            <div key={b.slug} style={themeVars(b.slug)}>
              <h3 className="box-accent text-[15px] font-bold">{b.name}</h3>
              <ul className="mt-4 grid grid-cols-3 gap-2">
                {b.items.map((i) => (
                  <li key={i.slug} className="flex flex-col gap-2 text-[13px] font-bold text-ink">
                    <span className="grid size-16 place-items-center rounded-[18px] bg-box-chip">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={i.image} alt="" className="size-11" />
                    </span>
                    {i.label}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 grid items-center gap-6 rounded-[32px] bg-oat p-6 md:grid-cols-[240px_1fr_auto] md:gap-10 md:px-12 md:py-6">
        <Art src={CUSTOM_BOX_ART} alt="Caja abierta Tu MoodBox" className="mx-auto w-[190px] md:w-[200px]" />
        <div>
          <h2 className="h-display text-[26px] md:text-[32px]">¿Ninguna es exactamente lo que buscas?</h2>
          <p className="mt-3 text-[17px] text-muted">Arma tu propia MoodBox con los productos que más te gusten.</p>
        </div>
        <Link href="/personaliza" className="btn-primary">Personalizar mi caja</Link>
      </section>
    </div>
  );
}
