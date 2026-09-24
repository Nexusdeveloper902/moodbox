import type { ReactNode } from "react";
import { BOX_THEMES } from "@/lib/theme";

/** Two-column layout of "Iniciar sesión" / "Crear cuenta" with the brand panel. */
export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="wrap grid items-center gap-12 py-8 md:py-8 lg:grid-cols-[600px_1fr] lg:gap-[120px]">
      <div aria-hidden="true" className="relative hidden h-[800px] overflow-hidden rounded-[32px] bg-[#f6dcc4] lg:block">
        <div className="absolute top-10 right-10 size-[280px] rounded-full bg-[#f5cfa8]" />
        {/* eslint-disable @next/next/no-img-element */}
        <img src={BOX_THEMES["necesito-relajarme"]!.closed} alt="" className="absolute top-[200px] left-[250px] w-[250px] rotate-[4deg]" />
        <img src={BOX_THEMES["dia-dificil"]!.closed} alt="" className="absolute top-[300px] left-[45px] w-[260px] -rotate-[4deg]" />
        <img src={BOX_THEMES["quiero-sorprender"]!.closed} alt="" className="absolute top-[400px] left-[220px] w-[280px]" />
        {/* eslint-enable @next/next/no-img-element */}
        <p className="absolute bottom-[110px] left-[50px] font-hand text-[34px] text-[#c4623a]">Un pequeño detalle puede cambiar tu día.</p>
        <p className="absolute bottom-[25px] left-[50px] max-w-[480px] text-[17px] leading-normal text-muted">Guarda tus direcciones, revisa tus pedidos y vuelve a regalar en segundos.</p>
      </div>
      <div className="mx-auto w-full max-w-[520px]">
        <h1 className="h-display text-[40px] text-ink md:text-[52px]">{title}</h1>
        <p className="mt-4 mb-8 text-lg text-muted">{subtitle}</p>
        {children}
      </div>
    </div>
  );
}
