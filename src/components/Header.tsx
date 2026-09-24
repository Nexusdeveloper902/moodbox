"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { cartCount, useStore } from "@/lib/store";

const NAV = [
  { href: "/", label: "Inicio", match: (p: string) => p === "/" || p.startsWith("/resultado") || p.startsWith("/pedido") },
  { href: "/moodbox", label: "MoodBox", match: (p: string) => p.startsWith("/moodbox") },
  { href: "/productos", label: "Productos", match: (p: string) => p.startsWith("/productos") },
  { href: "/personaliza", label: "Personaliza tu caja", match: (p: string) => p.startsWith("/personaliza") },
];

export function Header({ signedIn }: { signedIn: boolean }) {
  const pathname = usePathname();
  const { cart } = useStore();
  const count = cartCount(cart);
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const open = menuFor === pathname; // closes itself on navigation

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuFor(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);

  const cartLabel = count ? `Carrito, ${count} ${count === 1 ? "producto" : "productos"}` : "Carrito vacío";

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream">
      <div className="wrap flex h-16 items-center justify-between md:h-[88px]">
        <div className="md:hidden"><Logo size="sm" /></div>
        <div className="hidden md:block"><Logo /></div>

        <nav aria-label="Principal" className="hidden items-center gap-2 lg:flex">
          {NAV.map((n) => {
            const active = n.match(pathname);
            return (
              <Link key={n.href} href={n.href} aria-current={active ? "page" : undefined}
                className={`rounded-full px-4 py-[9px] text-base font-medium transition ${active ? "bg-blush text-coral" : "text-ink hover:bg-white"}`}>
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/carrito" aria-label={cartLabel}
            className={`relative grid size-11 place-items-center rounded-full border-[1.5px] bg-white md:size-12 ${pathname === "/carrito" ? "border-coral text-coral" : "border-line text-ink"}`}>
            <Icon name="cart" />
            {count > 0 && (
              <span aria-hidden="true" className="absolute -top-1.5 -right-1.5 grid size-[22px] place-items-center rounded-full border-2 border-cream bg-coral text-xs font-bold text-white">
                {count > 9 ? "9+" : count}
              </span>
            )}
          </Link>
          <Link href="/cuenta"
            className={`hidden items-center gap-2 rounded-full px-4 py-3 text-[15px] leading-none font-semibold md:flex ${signedIn ? "bg-ink text-white" : "border-[1.5px] border-line bg-white text-ink hover:border-ink"}`}>
            <Icon name="user" /> Mi cuenta
          </Link>
          <button type="button" onClick={() => setMenuFor(pathname)} aria-expanded={open} aria-controls="mobile-menu"
            className="grid size-11 place-items-center rounded-full bg-ink text-white lg:hidden">
            <Icon name="menu" /><span className="sr-only">Abrir menú</span>
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menú" className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-cream px-5 pb-8">
          <div className="flex h-16 items-center justify-between md:h-[88px]">
            <Logo size="sm" />
            <button type="button" onClick={() => setMenuFor(null)} className="grid size-11 place-items-center rounded-full bg-ink text-white" autoFocus>
              <Icon name="close" /><span className="sr-only">Cerrar menú</span>
            </button>
          </div>
          <nav aria-label="Menú móvil" className="mt-6 flex flex-col gap-1">
            {[...NAV, { href: "/carrito", label: `Carrito${count ? ` (${count})` : ""}`, match: (p: string) => p === "/carrito" }, { href: "/cuenta", label: "Mi cuenta", match: (p: string) => p.startsWith("/cuenta") }].map((n) => {
              const active = n.match(pathname);
              return (
                <Link key={n.href} href={n.href} aria-current={active ? "page" : undefined}
                  className={`flex items-center justify-between rounded-2xl px-[18px] py-4 font-serif text-[26px] font-semibold ${active ? "bg-blush text-coral" : "text-ink"}`}>
                  {n.label} <Icon name="chevron" className="text-subtle" />
                </Link>
              );
            })}
          </nav>
          <div className="mt-10 rounded-3xl border-[1.5px] border-line bg-white p-5">
            <p className="font-serif text-[23px] font-semibold">¿Cómo te sientes hoy?</p>
            <p className="mt-1 text-sm text-muted">Cuéntanos y te recomendamos una caja.</p>
            <Link href="/#como-te-sientes" className="btn-primary mt-4 w-full">Encontrar mi MoodBox</Link>
          </div>
          <p className="mt-auto pt-10 text-center font-hand text-xl text-coral">Un pequeño detalle puede cambiar tu día.</p>
        </div>
      )}
    </header>
  );
}
