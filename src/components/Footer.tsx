import Link from "next/link";
import { Logo } from "./Logo";

const COLUMNS = [
  { title: "Tienda", links: [["MoodBox", "/moodbox"], ["Productos", "/productos"], ["Personaliza tu caja", "/personaliza"]] },
  { title: "Ayuda", links: [["Envíos y entregas", "/ayuda#envios"], ["Preguntas frecuentes", "/ayuda#preguntas"], ["Contacto", "/ayuda#contacto"]] },
  { title: "Tu cuenta", links: [["Iniciar sesión", "/login"], ["Mis pedidos", "/cuenta/pedidos"], ["Datos personales", "/cuenta/datos"]] },
];

export function Footer() {
  return (
    <footer className="mt-auto bg-ink text-cream">
      <div className="wrap pt-12 pb-8 md:pt-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
          <div className="max-w-[420px]">
            <Logo dark />
            <p className="mt-6 font-hand text-2xl text-coral md:text-[28px]">Un pequeño detalle puede cambiar tu día.</p>
            <p className="mt-4 max-w-[330px] text-[15px] leading-[1.5] text-plum-muted">Cajas de regalo según cómo te sientes. Hechas con cariño en Colombia.</p>
          </div>
          <div className="hidden grid-cols-3 gap-8 md:grid lg:gap-[72px]">
            {COLUMNS.map((c) => (
              <div key={c.title}>
                <h2 className="kicker text-cream">{c.title}</h2>
                <ul className="mt-4 flex flex-col gap-3">
                  {c.links.map(([label, href]) => (
                    <li key={href}><Link href={href} className="text-[15px] text-plum-muted hover:text-white">{label}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <nav aria-label="Pie de página" className="text-[15px] leading-[1.8] text-plum-muted md:hidden">
            {[["MoodBox", "/moodbox"], ["Productos", "/productos"], ["Personaliza tu caja", "/personaliza"], ["Mis pedidos", "/cuenta/pedidos"], ["Ayuda", "/ayuda"]].map(([label, href], i) => (
              <span key={href}>{i > 0 && " · "}<Link href={href} className="hover:text-white">{label}</Link></span>
            ))}
          </nav>
        </div>
        <div className="mt-10 md:mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-[13px] text-plum-muted sm:flex-row sm:justify-between">
          <p>© 2026 MoodBox · Prototipo para presentación</p>
          <p className="font-bold text-cream">Instagram · TikTok · WhatsApp</p>
        </div>
      </div>
    </footer>
  );
}
