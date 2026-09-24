import Link from "next/link";

/** Shared look for not-found / error pages (based on "Carrito — Vacío"). */
export function EmptyState({ title, text, actions }: { title: string; text: string; actions: [string, string][] }) {
  return (
    <div className="wrap py-12 md:py-20">
      <div className="flex flex-col items-center rounded-[32px] border border-line bg-white px-6 py-14 text-center">
        <div className="grid size-[180px] place-items-center rounded-[32px] bg-oat">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/moodbox/cajas/carrito-vacio.svg" alt="" loading="lazy" className="w-[160px]" />
        </div>
        <h1 className="mt-6 font-serif text-[34px] font-semibold text-ink">{title}</h1>
        <p className="mt-3 max-w-[560px] text-[17px] text-muted">{text}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {actions.map(([label, href], i) => <Link key={href} href={href} className={i === 0 ? "btn-primary" : "btn-outline"}>{label}</Link>)}
        </div>
      </div>
    </div>
  );
}
