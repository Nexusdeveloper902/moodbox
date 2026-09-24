"use client";
import Link from "next/link";
import { Icon } from "./Icon";
import { MAX_BOX_ITEMS } from "@/lib/pricing";

/**
 * Sticky banner shown while the MoodBox has no free slots. `nudge` changes each
 * time someone tries to add another product, replaying the shake and re-announcing it.
 */
export function BoxFullNotice({ nudge, action, className = "" }: { nudge: number; className?: string; action?: { label: string; href?: string; onClick?: () => void; mobileOnly?: boolean } }) {
  return (
    <div className={`sticky top-[76px] z-20 md:top-[100px] ${className}`}>
      <div key={nudge} role="status" aria-live="polite"
        className={`flex items-center gap-3 rounded-2xl border-[1.5px] border-honey bg-honey-soft px-3 py-2.5 shadow-soft sm:px-4 sm:py-3 md:gap-4 md:px-5 ${nudge ? "animate-nudge" : ""}`}>
        <span className="hidden size-10 shrink-0 sm:grid place-items-center rounded-xl bg-white text-honey-dark"><Icon name="gift" size={20} /></span>
        <p className="flex-1 text-sm leading-snug text-ink md:text-[15px]">
          <span className="block font-bold">Tu MoodBox está llena<span className="hidden sm:inline"> ({MAX_BOX_ITEMS} de {MAX_BOX_ITEMS} espacios)</span></span>
          <span className="text-muted"><span className="sm:hidden">Quita algo para agregar otro.</span><span className="hidden sm:inline">Quita un producto o baja una cantidad para agregar otro.</span></span>
        </p>
        {action && (action.href
          ? <Link href={action.href} className="shrink-0 rounded-full bg-ink px-4 py-2 text-sm font-bold text-white">{action.label}</Link>
          : <button type="button" onClick={action.onClick} className={`${action.mobileOnly ? "lg:hidden" : ""} shrink-0 rounded-full bg-ink px-4 py-2 text-sm font-bold text-white`}>{action.label}</button>)}
      </div>
    </div>
  );
}
