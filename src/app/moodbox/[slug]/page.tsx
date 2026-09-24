import { notFound } from "next/navigation";
import { Art } from "@/components/Art";
import { BoxActions } from "@/components/BoxActions";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Gallery } from "@/components/Gallery";
import { Icon } from "@/components/Icon";
import { MoodBoxMini } from "@/components/MoodBoxCard";
import { getMoodbox, getMoodboxes } from "@/lib/data";
import { BOX_THEMES, boxLabel, themeVars } from "@/lib/theme";

export async function generateMetadata({ params }: PageProps<"/moodbox/[slug]">) {
  const box = await getMoodbox((await params).slug);
  return { title: box?.name ?? "MoodBox no encontrada" };
}

export default async function MoodBoxDetail({ params }: PageProps<"/moodbox/[slug]">) {
  const box = await getMoodbox((await params).slug);
  if (!box) notFound();
  const theme = BOX_THEMES[box.slug]!;
  const others = (await getMoodboxes()).filter((b) => b.slug !== box.slug);

  /* eslint-disable @next/next/no-img-element */
  const slides = [
    <Art key="open" src={theme.open} alt={`Caja abierta ${box.name}`} className="h-[82%] w-[82%]" />,
    <img key="closed" src={theme.closed} alt={`Caja ${box.name} cerrada`} className="w-[60%]" />,
    ...box.items.slice(1).map((i) => <img key={i.slug} src={i.image} alt={i.label} className="w-[45%]" />),
  ];
  /* eslint-enable @next/next/no-img-element */

  return (
    <div style={themeVars(box.slug)}>
      <div className="wrap pt-6 md:pt-8">
        <Breadcrumbs items={[["Inicio", "/"], ["MoodBox", "/moodbox"], [box.name]]} />
        <div className="mt-6 grid gap-8 lg:grid-cols-[660px_1fr] lg:gap-[60px]">
          <Gallery slides={slides} labels={["Caja abierta", "Caja cerrada", ...box.items.slice(1).map((i) => i.label)]} />
          <div>
            <p className="kicker box-accent text-[13px]">{boxLabel(box.number)} · {box.mood}</p>
            <h1 className="box-ink mt-3 font-serif text-[40px] leading-[1.1] font-semibold md:text-[64px]">{box.name}</h1>
            <p className="box-accent mt-4 font-hand text-[26px] leading-[1.25] md:text-[30px]">{box.quote}</p>
            <p className="mt-4 text-[17px] leading-[1.55] text-muted">{box.description}</p>
            <h2 className="mt-6 text-[15px] font-bold text-ink">Esta caja incluye:</h2>
            <ul className="mt-4 mb-8 flex flex-col gap-4">
              {box.items.map((i) => (
                <li key={i.slug} className="flex items-center gap-4">
                  <span className="grid size-[60px] shrink-0 place-items-center rounded-[18px] bg-white shadow-soft">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={i.image} alt="" className="size-10" />
                  </span>
                  <span>
                    <span className="block text-lg font-bold text-ink">{i.label}</span>
                    <span className="block text-sm text-muted">{i.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
            <BoxActions slug={box.slug} name={box.name} price={box.price}
              prefill={box.items.filter((i) => i.in_catalog).map((i) => i.slug)} />
            <p className="mt-6 flex items-center gap-3 text-sm text-muted"><Icon name="truck" size={18} /> Llega en 2 a 4 días hábiles a cualquier ciudad de Colombia</p>
          </div>
        </div>
      </div>
      <section className="wrap mt-16 mb-20 md:mt-20" aria-labelledby="tambien">
        <h2 id="tambien" className="h-display text-[26px] md:text-[34px]">También te pueden gustar</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:w-2/3 lg:gap-8">
          {others.map((b) => <MoodBoxMini key={b.slug} box={b} />)}
        </div>
      </section>
    </div>
  );
}
