export const metadata = { title: "Ayuda" };

const FAQ = [
  ["¿Cuánto cuesta el envío?", "Nada. Todas las MoodBox llegan con envío gratis a cualquier ciudad de Colombia."],
  ["¿Puedo cambiar lo que trae una caja?", "Sí. Desde el detalle de cada MoodBox toca “Personalizar esta caja” o arma una desde cero en Personaliza tu caja."],
  ["¿Quién escribe la carta?", "Nosotros la escribimos a mano con el mensaje que nos dejes y la ponemos dentro de la caja."],
  ["¿Se hace un cobro real?", "No. MoodBox es un prototipo: la compra es simulada y no pedimos datos de tarjeta."],
];

export default function HelpPage() {
  return (
    <div className="wrap max-w-[860px] pt-10 pb-20">
      <h1 className="h-display text-[40px] text-ink md:text-[64px]">Ayuda</h1>
      <section id="envios" className="mt-10 scroll-mt-28">
        <h2 className="h-display text-[28px] text-ink">Envíos y entregas</h2>
        <p className="mt-3 text-[17px] leading-relaxed text-muted">Tu MoodBox llega en 2 a 4 días hábiles a cualquier ciudad de Colombia. Puedes ver el estado de cada pedido en Mi cuenta → Mis pedidos.</p>
      </section>
      <section id="preguntas" className="mt-10 scroll-mt-28">
        <h2 className="h-display text-[28px] text-ink">Preguntas frecuentes</h2>
        <div className="mt-4 flex flex-col gap-3">
          {FAQ.map(([q, a]) => (
            <details key={q} className="panel group p-5">
              <summary className="cursor-pointer font-bold text-ink">{q}</summary>
              <p className="mt-3 text-muted">{a}</p>
            </details>
          ))}
        </div>
      </section>
      <section id="contacto" className="mt-10 scroll-mt-28">
        <h2 className="h-display text-[28px] text-ink">Contacto</h2>
        <p className="mt-3 text-[17px] text-muted">Escríbenos por WhatsApp o Instagram y te respondemos el mismo día.</p>
      </section>
    </div>
  );
}
