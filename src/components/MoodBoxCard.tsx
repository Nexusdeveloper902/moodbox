import Link from "next/link";
import { Art } from "./Art";
import { Icon } from "./Icon";
import type { MoodBox } from "@/lib/data";
import { formatCOP } from "@/lib/format";
import { BOX_THEMES, boxLabel, themeVars } from "@/lib/theme";

/** "Tarjeta de MoodBox" component: scene, kicker, name, contents and price. */
export function MoodBoxCard({ box }: { box: MoodBox }) {
  return (
    <article style={themeVars(box.slug)} className="card relative flex flex-col gap-5 p-3 pb-6">
      <div className="flex aspect-[376/290] items-end justify-center rounded-[20px] bg-box-scene px-6 pb-3.5">
        <Art src={BOX_THEMES[box.slug]!.open} alt={`Caja abierta ${box.name}`} className="h-[90%]" />
      </div>
      <div className="flex flex-1 flex-col gap-2 px-4">
        <p className="kicker box-accent">{boxLabel(box.number)}</p>
        <h3 className="box-ink font-serif text-[26px] leading-[1.1] font-semibold md:text-[28px]">{box.name}</h3>
        <p className="box-muted text-[15px] leading-[1.45]">{box.summary}</p>
        <ul className="mt-1 flex flex-wrap gap-1.5" aria-label="Incluye">
          {box.items.map((i) => (
            <li key={i.slug} className="box-ink rounded-full bg-box-chip px-2.5 py-[5px] text-[13px] font-semibold">{i.label}</li>
          ))}
        </ul>
      </div>
      <div className="flex items-center justify-between px-4">
        <p className="box-ink font-serif text-[28px] font-semibold">{formatCOP(box.price)}</p>
        {/* Whole card is clickable via the stretched link. */}
        <Link href={`/moodbox/${box.slug}`} className="bg-box-accent inline-flex items-center gap-2 rounded-full px-[22px] py-3 text-[15px] font-bold text-white after:absolute after:inset-0 after:rounded-[28px]">
          Ver caja<span className="sr-only">: {box.name}</span> <Icon name="arrow" />
        </Link>
      </div>
    </article>
  );
}

/** Small horizontal card used in "¿No es lo que buscabas?" and "También te pueden gustar". */
export function MoodBoxMini({ box }: { box: MoodBox }) {
  return (
    <article style={themeVars(box.slug)} className="relative flex items-center gap-4 rounded-3xl border-[1.5px] border-line bg-white p-4 md:gap-5">
      <div className="grid size-24 shrink-0 place-items-center rounded-[18px] bg-box-scene md:size-[122px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={BOX_THEMES[box.slug]!.closed} alt="" className="w-[80%]" />
      </div>
      <div>
        <h3 className="box-ink font-serif text-[21px] leading-[1.15] font-semibold md:text-[23px]">{box.name}</h3>
        <p className="box-accent mt-1 text-[17px] font-bold">{formatCOP(box.price)}</p>
        <Link href={`/moodbox/${box.slug}`} className="mt-2 inline-flex items-center gap-2 text-[15px] font-bold text-ink after:absolute after:inset-0 after:rounded-3xl">
          Ver caja<span className="sr-only">: {box.name}</span> <Icon name="arrow" />
        </Link>
      </div>
    </article>
  );
}

/** Mobile home list row ("Móvil · Inicio"). */
export function MoodBoxRow({ box }: { box: MoodBox }) {
  return (
    <article style={themeVars(box.slug)} className="relative flex items-center gap-4 rounded-3xl border-[1.5px] border-line bg-white p-3.5">
      <div className="grid size-[104px] shrink-0 place-items-center rounded-[18px] bg-box-scene">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={BOX_THEMES[box.slug]!.closed} alt="" className="w-[78%]" />
      </div>
      <div className="min-w-0">
        <p className="kicker box-accent text-[11px]">{boxLabel(box.number)}</p>
        <h3 className="mt-1">
          <Link href={`/moodbox/${box.slug}`} className="box-ink font-serif text-[20px] leading-[1.1] font-semibold after:absolute after:inset-0 after:rounded-3xl">{box.name}</Link>
        </h3>
        <p className="box-muted mt-1 text-[12px]">{box.items.map((i) => i.label).join(" · ")}</p>
        <p className="box-ink mt-1 text-[17px] font-bold">{formatCOP(box.price)}</p>
      </div>
    </article>
  );
}
