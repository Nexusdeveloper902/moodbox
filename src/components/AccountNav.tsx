"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "./Icon";
import { logout } from "@/app/actions";

const LINKS: [string, string, IconName][] = [["/cuenta", "Resumen", "sparkle"], ["/cuenta/pedidos", "Mis pedidos", "box"], ["/cuenta/datos", "Datos personales", "user"]];

export function AccountNav({ name, email, initials }: { name: string; email: string; initials: string }) {
  const path = usePathname();
  return (
    <nav aria-label="Mi cuenta" className="panel p-4">
      <div className="flex items-center gap-3 px-2 pt-2 pb-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-coral text-lg font-bold text-white">{initials}</span>
        <div className="min-w-0">
          <p className="truncate font-bold text-ink">{name}</p>
          <p className="truncate text-[13px] text-muted">{email}</p>
        </div>
      </div>
      <ul className="flex flex-row flex-wrap gap-1 lg:flex-col">
        {LINKS.map(([href, label, icon]) => {
          const active = href === "/cuenta" ? path === href : path.startsWith(href);
          return (
            <li key={href}>
              <Link href={href} aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-[15px] ${active ? "bg-blush font-semibold text-coral" : "text-ink hover:bg-cream"}`}>
                <Icon name={icon} size={18} /> {label}
              </Link>
            </li>
          );
        })}
        <li>
          <form action={logout}>
            <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-[15px] text-coral hover:bg-cream"><Icon name="logout" size={18} /> Cerrar sesión</button>
          </form>
        </li>
      </ul>
    </nav>
  );
}
